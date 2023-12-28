import { createAsyncThunk } from "@reduxjs/toolkit";
import Parse from "parse/react-native.js";

type user = {
  email: string;
  password: string;
};

export const signUp = createAsyncThunk("auth/signUp", async (user: user) => {
  const userCreate = new Parse.User();

  const userObj = {
    username: user.email,
    password: user.password
  };
  try {
    const userDetails = await userCreate.signUp(userObj);
  } catch (err) {
    console.log("error in signup thunk");
    console.log(err);
  }
});
