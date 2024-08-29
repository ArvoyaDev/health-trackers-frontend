import { createAction, createReducer } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  void,
  unknown,
  Action<string>
>;

interface JWTData {
  name?: string;
  family_name?: string;
  email?: string;
  sub?: string;
}

interface JWTAuthData {
  exp: number;
}

interface LoginPayload {
  accessToken: string | null;
  isAuth: boolean;
  user: User;
}
export interface TokenState {
  accessToken: string | null;
  isAuth: boolean;
  user: User;
}
interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  sub: string | null;
}

const initialState: TokenState = {
  accessToken: null,
  isAuth: false,
  user: {
    firstName: null,
    lastName: null,
    email: null,
    sub: null,
  },
};


export const login = createAction<LoginPayload>("LOGIN");
export const authCheck = createAction<{ isAuth: boolean }>("AUTH_CHECK");

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    })
    .addCase(authCheck, (state, action) => {
      state.isAuth = action.payload.isAuth;
    });
});

export const signIn = (username: string, password: string, url: string): AppThunk => async (dispatch) => {
  const res = await axios.post(
    `${url}/aws-cognito/sign-in`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
  const accessToken = res.data.accessToken;
  const idToken = res.data.idToken
  const idData = jwtDecode<JWTData>(idToken);
  const user: User = {
    firstName: idData.name || null,
    lastName: idData.family_name || null,
    email: idData.email || null,
    sub: idData.sub || null,
  };
  dispatch(login({ accessToken: accessToken, user, isAuth: true }));
};

export const refreshAccessToken = (url: string): AppThunk => async (dispatch) => {
  const res = await axios.post(`${url}/aws-cognito/refresh-token`, {}, {
    withCredentials: true,
  });
  const accessToken = res.data.accessToken;
  const idToken = res.data.idToken
  const idData = jwtDecode<JWTData>(idToken);
  const user: User = {
    firstName: idData.name || null,
    lastName: idData.family_name || null,
    email: idData.email || null,
    sub: idData.sub || null,
  };
  dispatch(login({ accessToken: accessToken, user, isAuth: true }));
}

export const verifyAuthToken = (token: string): AppThunk => async (dispatch) => {
  const authData = jwtDecode<JWTAuthData>(token);
  if (authData.exp && authData.exp > Date.now() / 1000) {
    dispatch(authCheck({ isAuth: true }));
  } else {
    dispatch(authCheck({ isAuth: false }));
    dispatch(refreshAccessToken(import.meta.env.VITE_BACKEND_URL));
  }
}

export default authReducer;
