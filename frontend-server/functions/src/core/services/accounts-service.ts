import axios from "axios";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { UserFirestoreModel } from "../data/models/user/firestore/user-firestore-model";
import { User } from "../data/user";
import { HttpResponseError } from "../utils/http-response-error";

class AccountsService {
  private adminEmail: string = process.env.ADMIN_EMAIL;
  private firecmsURL: string = process.env.FIRECMS_URL;

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

      admin
        .firestore()
        .collection("mail")
        .doc()
        .set({
          to: user.email,
          message: {
            subject: "Account Approval",
            html: `Hello,<br>Your account has been successfully approved. You can now <a href="${this.firecmsURL}">access your account</a> and start serving your customers.`,
          },
        })
        .then(() => {
          console.log("Account approval email queued for sending.");
        })
        .catch((error) => {
          console.error("Failed to queue account approval email: ", error);
        });
    } catch (err) {
      throw new HttpResponseError(
        500,
        "Error approving account",
        `Error approving account ${err}`
      );
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

      admin
        .firestore()
        .collection("mail")
        .doc()
        .set({
          to: user.email,
          message: {
            subject: "Account Rejection",
            html: `Hello,<br>Your parking owner account application has been rejected. Please <a href="mailto:${this.adminEmail}">contact the team</a> for more information.`,
          },
        })
        .then(() => {
          console.log("Account rejection email queued for sending.");
        })
        .catch((error) => {
          console.error("Failed to queue account rejection email: ", error);
        });
    } catch (error) {
      throw new HttpResponseError(
        500,
        "APPROVAL_PROCESS_ERROR",
        `An error occurred during the approval process ${error}`
      );
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
        approved: user.role == "admin" ? true : false,
      });

      const documentData = UserFirestoreModel.fromEntity(user).toDocumentData();
      await admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(documentData);

      // Additionally, create or update the document in a role-specific top level collection
      const roleSpecificCollection = admin.firestore().collection(user.role);
      await roleSpecificCollection.doc(user.uid).set(documentData);

      if (user.role === "parkingOwner") {
        // inform the admins
        const admins = await admin.firestore().collection("admin").get();
        admins.forEach((adminUser) => {
          const data = adminUser.data();

          admin
            .firestore()
            .collection("mail")
            .doc()
            .set({
              to: data.email,
              message: {
                subject: "New Parking Owner Application",
                html: `Hello,<br>There is a new parking owner application. Please <a href="${this.firecmsURL}">review the application</a> and approve or reject it.`,
              },
            })
            .then(() => {
              console.log(
                "New parking owner application email queued for sending."
              );
            })
            .catch((error) => {
              console.error(
                "Failed to queue new parking owner application email: ",
                error
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

    admin
      .firestore()
      .collection("mail")
      .doc()
      .set({
        to: user.email,
        message: {
          subject: "Verify Your Account",
          html: `Hello ${user.displayName},<br>Please verify your account by clicking on the following link: <a href="${link}">Verify Account</a>`,
        },
      })
      .then(() => {
        console.log("Verification Email queued for sending.");
      })
      .catch((error) => {
        console.error("Failed to queue email: ", error);
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
    //delete the user from the firestore
    const user = await this.getUser(uid);

    await admin.firestore().collection("users").doc(uid).delete();

    //delete the user from the role specific collection and vehicle (subcollection)
    await admin
      .firestore()
      .recursiveDelete(admin.firestore().collection(user.role).doc(uid));
    //send email to the user

    await admin
      .firestore()
      .collection("mail")
      .doc()
      .set({
        to: user.email,
        message: {
          subject: "Account Deletion Confirmation",
          html: `Hello,<br>Your account has been successfully deleted. If this was a mistake, please contact our support.`,
        },
      });

    await admin.auth().deleteUser(uid);
  }
}

export const accountsService: AccountsService = new AccountsService();
