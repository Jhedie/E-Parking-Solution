import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { UserFirestoreModel } from "../data/models/user/firestore/user-firestore-model";
import { User } from "../data/user";
import { HttpResponseError } from "../utils/http-response-error";
const sgMail = require("@sendgrid/mail");

class AccountsService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async approveParkingOwner(uid: string): Promise<void> {
    const user = await admin.auth().getUser(uid);
    try {
      const currentClaims =
        (await admin.auth().getUser(uid)).customClaims || {};
      const updatedClaims = {
        ...currentClaims,
        approved: true,
        rejected: false,
      };

      await admin.auth().setCustomUserClaims(uid, updatedClaims);

      // Update the user's status in Firestore to "approved"
      await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({ status: "approved" });

      await admin
        .firestore()
        .collection("parkingOwner")
        .doc(uid)
        .update({ status: "approved" });

      try {
        await this.sendApprovalUpdateEmail(
          user.email,
          "Hi, Your account has been approved",
          "You can now access all your account and start serving your customers",
          "Get Started",
          "http://localhost:5173/app/"
        );
      } catch (emailError) {
        console.error(
          "Failed to send approval email, but account was approved:",
          emailError
        );
      }
    } catch (error) {
      console.error("Error during the approval process:", error);
      // Attempt to send a failure email if there was an error other than email sending
      try {
        await this.sendApprovalUpdateEmail(
          "jeddiahawuku12@gmail.com",
          `Hi, There was an error approving user account ${user.email}`,
          "Kindly Investigate",
          "Admin Dashboard",
          "http://localhost:5173/app/"
        );
      } catch (emailError) {
        console.error("Failed to send error email:", emailError);
      }

      // Rethrow the original error with a more specific message if possible
      if (error instanceof Error) {
        throw new HttpResponseError(404, error.name, error.message);
      } else {
        throw new HttpResponseError(
          500,
          "APPROVAL_PROCESS_ERROR",
          "An error occurred during the approval process"
        );
      }
    }
  }

  async rejectParkingOwner(uid: string): Promise<void> {
    const user = await admin.auth().getUser(uid);
    try {
      const currentClaims =
        (await admin.auth().getUser(uid)).customClaims || {};
      const updatedClaims = {
        ...currentClaims,
        approved: false,
        rejected: true,
      };

      await admin.auth().setCustomUserClaims(uid, updatedClaims);

      // Update the user's status in Firestore instead of deleting
      await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({ status: "rejected" });

      await admin
        .firestore()
        .collection("parkingOwner")
        .doc(uid)
        .update({ status: "rejected" });

      try {
        await this.sendApprovalUpdateEmail(
          user.email,
          "Hi, Your parking owner account application has been rejected",
          "Kindly contact the team for more information",
          "Contact Support",
          "mailto:jeddiahawuku12@gmail.com"
        );
      } catch (emailError) {
        console.error(
          "Failed to send rejection email, but account was rejected:",
          emailError
        );
      }
    } catch (error) {
      console.error("Error during the rejection process:", error);
      try {
        await this.sendApprovalUpdateEmail(
          "jeddiahawuku12@gmail.com",
          `Hi, There was an error rejecting user account ${user.email}`,
          "Kindly Investigate",
          "Admin Dashboard",
          "http://localhost:5173/app/"
        );
      } catch (emailError) {
        console.error("Failed to send error email:", emailError);
      }

      // Rethrow the original error with a more specific message if possible
      if (error instanceof Error) {
        throw new HttpResponseError(404, error.name, error.message);
      } else {
        throw new HttpResponseError(
          500,
          "APPROVAL_PROCESS_ERROR",
          "An error occurred during the approval process"
        );
      }
    }
  }

  async createAccount(userInput: User, password: string): Promise<User> {
    try {
      const createUserRes = await admin.auth().createUser({
        displayName: userInput.name,
        email: userInput.email,
        password: password,
      });

      //add the uid to the user object after creating the user
      const user = userInput.copyWith({ uid: createUserRes.uid });

      await admin.auth().setCustomUserClaims(user.uid, {
        driver: user.role == "driver", //true or false
        parkingOwner: user.role == "parkingOwner", //true or false
        admin: user.role == "admin", //true or false
        approved: false,
      });

      const documentData = UserFirestoreModel.fromEntity(user).toDocumentData();
      await admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(documentData);

      // Additionally, create or update the document in a role-specific collection
      const roleSpecificCollection = admin.firestore().collection(user.role);
      await roleSpecificCollection.doc(user.uid).set(documentData);

      if (user.role === "parkingOwner") {
        // inform the admins
        const admins = await admin.firestore().collection("admin").get();
        admins.forEach((admin) => {
          const data = admin.data();
          this.sendApprovalEmail(
            data.email,
            "http://localhost:5173/app/"
          ).catch((err) => {
            throw new HttpResponseError(
              500,
              "EMAIL_SENDING_ERROR",
              "Error sending email"
            );
          });
        });
      }

      return user;
    } catch (e) {
      if (typeof e === "object" && e !== null && "code" in e) {
        switch (e.code) {
          case "auth/email-already-exists":
            throw new HttpResponseError(
              400,
              "EXISTING_EMAIL",
              "Email is already in use"
            );
        }
      }
      throw e;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<any> {
    console.log("email at sendVerificationEmail", email);
    console.log("token at sendVerificationEmail", token);
    const user: UserRecord = await admin.auth().getUserByEmail(email);

    console.log("user", user);

    //verify the token to ensure the user is the same as the user in the token for security
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log("uid", uid);

        if (user.uid !== uid) {
          throw new HttpResponseError(
            400,
            "INVALID_TOKEN",
            "Wrong token being used for this user"
          );
        }
      });
    const link: string = await admin
      .auth()
      .generateEmailVerificationLink(user.email);
    this.sendMail(user, link).catch((err) => {
      throw new HttpResponseError(
        500,
        "EMAIL_SENDING_ERROR",
        "Error sending email"
      );
    });
  }

  async generateCustomToken(uid: string): Promise<string> {
    try {
      const adminToken = await admin.auth().createCustomToken(uid);
      return adminToken;
    } catch (error) {
      console.error("Error admin token gen:", error);
      throw new HttpResponseError(
        500,
        "TOKEN_GENERATION_ERROR",
        "Error generating token"
      );
    }
  }

  async generateUserToken(
    email: string,
    password: string,
    uid: string
  ): Promise<string> {
    console.log("generateUserToken", email, password);
    const data = {
      email: email, // The user's email address
      password: password, // The user's password
      returnSecureToken: true, // Whether or not to return an ID and refresh token. Should be true.
    };

    const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.API_KEY_TOKEN_REQUEST}`;
    try {
      const response = await axios.post(url, data);
      // Extract the token from the response
      const token = response.data.idToken;

      console.log("token from identitytoolkit: " + token);
      return token;
    } catch (error) {
      console.error("Error:", error);
      throw new HttpResponseError(
        500,
        "TOKEN_GENERATION_ERROR",
        "Error generating token"
      );
    }
  }

  async getUser(uid: string): Promise<User> {
    try {
      // Get the user from Firebase Authentication
      const userRecord = await admin.auth().getUser(uid);

      // Get the user's Firestore data
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        throw new HttpResponseError(
          404,
          "USER_NOT_FOUND",
          "User not found in firestore"
        );
      }

      // Assume fromDocumentData is a method that properly formats the document data into a user object
      const userFirestore = UserFirestoreModel.fromDocumentData(userDoc.data());

      // Return a new instance of UserFirestoreModel with the UID
      return userFirestore.copyWith({ uid: userRecord.uid });
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        throw new HttpResponseError(404, "USER_NOT_FOUND", "User not found");
      }
      // Re-throw the error if it's not a user-not-found error
      throw err;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    await admin.auth().deleteUser(uid);
    //delete the user from the firestore
    await admin.firestore().collection("users").doc(uid).delete();
  }

  sendMail = async (user: UserRecord, link: string): Promise<any> => {
    const to: string = user.email;
    const from: string = "jeddiahawuku12@gmail.com";

    const msg = {
      to,
      from,
      template_id: "d-f988b4d134f646cc846f64fdb4e37520",

      dynamic_template_data: {
        signedUpName: `${user.displayName}`,
        verificationLink: link,
      },
    };

    return await sgMail.send(msg);
  };

  sendApprovalEmail = async (email: string, link: string): Promise<any> => {
    const to: string = email;
    const from: string = "jeddiahawuku12@gmail.com";

    const msg = {
      to,
      from,
      template_id: "d-d367c14a5d964e8c93d04419abbc16a0",
      dynamic_template_data: {
        approvalLink: link,
      },
    };

    return await sgMail.send(msg);
  };

  sendApprovalUpdateEmail = async (
    email: string,
    approvalMessage: string,
    furtherInformation: string,
    actionMessage: string,
    link: string
  ): Promise<any> => {
    const to: string = email;
    const from: string = "jeddiahawuku12@gmail.com";

    const msg = {
      to,
      from,
      template_id: "d-47713f0267b84b8dab3ce0f14a6bb8a8",
      dynamic_template_data: {
        ApprovalMessage: approvalMessage,
        FurtherInformation: furtherInformation,
        ActionMessage: actionMessage,
        updateLink: link,
      },
    };

    return await sgMail.send(msg);
  };
}

export const accountsService: AccountsService = new AccountsService();
