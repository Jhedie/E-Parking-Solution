import * as admin from "firebase-admin";
import { UserFirestoreModel } from "../data/models/user/firestore/user-firestore-model";
import { User } from "../data/user";
import { HttpResponseError } from "../utils/http-response-error";

class AccountsService {
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
}

export const accountsService: AccountsService = new AccountsService();
