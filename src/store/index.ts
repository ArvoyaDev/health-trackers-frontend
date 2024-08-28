import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './user';

export default configureStore({
  reducer: {
    auth: tokenReducer,
  },
});


