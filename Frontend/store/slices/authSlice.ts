// import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type CounterState = {
  username: string;
  isSignedIn: boolean;
  error: null | string; // or whatever type your error is
};

const initialState: CounterState = {
  username: "",
  isSignedIn: false,
  error: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}
});

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default authSlice.reducer;
