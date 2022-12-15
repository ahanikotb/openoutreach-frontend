import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    token: "",
    user: {},
  },
  reducers: {
    setClient: (state, action) => {
      state.token = action.payload.client;
      state.user = action.payload.user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setClient } = userSlice.actions;

export default userSlice.reducer;
