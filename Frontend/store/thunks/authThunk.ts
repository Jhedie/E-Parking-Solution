import { createAsyncThunk } from "@reduxjs/toolkit";
import Parse from "parse/react-native";

type user = {
  username: string;
  password: string;
};

const signUp = createAsyncThunk("auth/signUp", async (user: user) => {
  const userCreate = new Parse.User();
  userCreate.set("username", user.username);
  userCreate.set("password", user.password);

  const UserDetails = await userCreate.signUp();
  console.log({
    username: UserDetails.get("username"),
    token: UserDetails.get("token")
  });
});
