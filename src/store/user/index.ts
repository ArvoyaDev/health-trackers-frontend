// src/store/user/index.ts
import { createAction, createReducer } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  void, // No global state
  unknown,
  Action<string>
>;

const initialState: TokenState = {
  accessToken: null,
  user: {
    firstName: null,
    lastName: null,
    email: null,
    sub: null,
  },
};


interface JWTData {
  name?: string;
  family_name?: string;
  email?: string;
  sub?: string;
  // Add other fields if needed
}

interface LoginPayload {
  accessToken: string;
  user: User;
}
interface TokenState {
  accessToken: string | null;
  user: User;
}
interface User {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  sub: string | null;
}

export const login = createAction<LoginPayload>("LOGIN");

const tokenReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    });
});

export const signIn = (username: string, password: string, url: string): AppThunk => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/sign-in`, {
      username,
      password,
    });
    const accessToken = res.data.accessToken;
    const idToken = res.data.idToken
    const idData = jwtDecode<JWTData>(idToken); // Use `any` here or define a type for idData
    const user: User = {
      firstName: idData.name || null,
      lastName: idData.family_name || null,
      email: idData.email || null,
      sub: idData.sub || null,
    };
    dispatch(login({ accessToken: accessToken, user }));
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = (url: string): AppThunk => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/refresh-token`, {}, {
      withCredentials: true, // Ensure credentials are included
    });
    const accessToken = res.data.accessToken;
    const idToken = res.data.idToken
    const idData = jwtDecode<JWTData>(idToken); // Use `any` here or define a type for idData
    const user: User = {
      firstName: idData.name || null,
      lastName: idData.family_name || null,
      email: idData.email || null,
      sub: idData.sub || null,
    };
    dispatch(login({ accessToken: accessToken, user }));
  } catch (error) {
    console.log(error);
  }
}

export default tokenReducer;
