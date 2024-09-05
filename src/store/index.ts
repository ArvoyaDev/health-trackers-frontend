import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth';
import trackerReducer from "./illnesses";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tracker: trackerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
