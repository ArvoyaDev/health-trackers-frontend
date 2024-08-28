import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './user';

const store = configureStore({
  reducer: {
    auth: tokenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
