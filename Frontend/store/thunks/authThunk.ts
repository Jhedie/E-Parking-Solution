import auth from "@react-native-firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

type user = {
  email: string;
  password: string;
};

export const signUp = createAsyncThunk("auth/signUp", async (user: user) => {
  console.log("In the user thunk");
  console.log("user", user);

  auth()
    .createUserWithEmailAndPassword(
      "jane.doe@example.com",
      "SuperSecretPassword!"
    )
    .then(() => {
      console.log("User account created & signed in!");
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
      }

      if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
      }

      console.error(error);
    });
});
