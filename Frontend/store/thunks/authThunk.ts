import { createAsyncThunk } from "@reduxjs/toolkit";


type user = {
  email: string;
  password: string;
};

export const signUp = createAsyncThunk("auth/signUp", async (user: user) => {
  console.log("In the user thunk")
  console.log("user", user);
});
