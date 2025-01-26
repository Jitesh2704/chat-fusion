import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  const user = state.auth.user;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
});

export { store };
