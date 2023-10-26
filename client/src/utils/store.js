import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import historySlice from "./historySlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    history: historySlice,
  },
});

export default store;
