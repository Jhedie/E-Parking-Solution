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

  async createAccount(userInput: User, password: string): Promise<User> {
    try {
      const createUserRes = await admin.auth().createUser({
        displayName: userInput.name,
        email: userInput.email,
        password: password,
      });

      const user = userInput.copyWith({ uid: createUserRes.uid });

      await admin.auth().setCustomUserClaims(user.uid, {
        driver: user.role == "driver", //true or false
        parkingOwner: user.role == "parkingOwner", //true or false
        admin: user.role == "admin", //true or false
      });

      const documentData = UserFirestoreModel.fromEntity(user).toDocumentData();
      await admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(documentData);

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
    const user: UserRecord = await admin
      .auth()
      .getUserByEmail(email)
      .catch((err) => {
        throw new HttpResponseError(404, "USER_NOT_FOUND", "User not found");
      });
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
}

export const accountsService: AccountsService = new AccountsService();
