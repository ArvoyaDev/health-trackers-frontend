import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './user'; // Adjust the import path if needed

const store = configureStore({
  reducer: {
    auth: tokenReducer,
  },
});

// Define and export RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
