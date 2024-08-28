import { createAction, createReducer } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

// Type for thunk actions
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  TokenState,
  unknown,
  Action<string>
>;

// Initial state for the token reducer
const initialState: TokenState = {
  accessToken: null,
  user: {
    firstName: null,
    lastName: null,
    email: null,
    sub: null,
  },
};

// User and token state types
interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  sub: string | null;
}

interface TokenState {
  accessToken: string | null;
  user: User;
}

interface LoginPayload {
  accessToken: string;
  user: User;
}

// Actions
export const login = createAction<LoginPayload>("LOGIN");

// Reducer
const tokenReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    });
});

// Thunk to handle sign-in
export const signIn = (username: string, password: string, url: string): AppThunk => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/sign-in`, {
      username,
      password,
    });
    const idToken = res.data.idToken;
    const idData = jwtDecode<{ name: string; family_name: string; email: string; sub: string }>(idToken);
    const user: User = {
      firstName: idData.name,
      lastName: idData.family_name,
      email: idData.email,
      sub: idData.sub,
    };
    dispatch(login({ accessToken: idToken, user }));
  } catch (error) {
    console.log(error);
  }
};

// Thunk to handle access token refresh
export const refreshAccessToken = (url: string): AppThunk => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/refresh-token`, {
      withCredentials: true,
    });
    const idToken = res.data.idToken;
    const idData = jwtDecode<{ name: string; family_name: string; email: string; sub: string }>(idToken);
    const user: User = {
      firstName: idData.name,
      lastName: idData.family_name,
      email: idData.email,
      sub: idData.sub,
    };
    dispatch(login({ accessToken: idToken, user }));
  } catch (error) {
    console.log(error);
  }
};

export default tokenReducer;
