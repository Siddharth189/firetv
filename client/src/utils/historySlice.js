import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    user_history: [],
  },
  reducers: {
    addMovieName: (state, action) => {
      state.user_history.push(action.payload);
    },
  },
});

export const { addMovieName } = historySlice.actions;

export default historySlice.reducer;
