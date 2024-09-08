import { createAction, createReducer } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../../store/'; // Adjust the path to your store

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
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
  signUp: {
    confirmed: boolean;
  }
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
  signUp: {
    confirmed: false,
  }
};

export const login = createAction<LoginPayload>("LOGIN");
export const authCheck = createAction<{ isAuth: boolean }>("AUTH_CHECK");
export const logout = createAction("LOGOUT");

const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuth = action.payload.isAuth;
    })
    .addCase(authCheck, (state, action) => {
      state.isAuth = action.payload.isAuth;
    })
    .addCase(logout, (state) => {
      state.accessToken = null;
      state.isAuth = false;
      state.user = initialState.user;
    });
});

export const signIn = (
  username: string,
  password: string,
  url: string
): AppThunk<Promise<{ success: boolean; message?: string }>> => async (dispatch) => {
  try {
    const res = await axios.post(
      `${url}/aws-cognito/sign-in`,
      { username, password },
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;
    const idToken = res.data.idToken;
    const idData = jwtDecode<JWTData>(idToken);

    const user: User = {
      firstName: idData.name || null,
      lastName: idData.family_name || null,
      email: idData.email || null,
      sub: idData.sub || null,
    };

    dispatch(login({ accessToken, user, isAuth: true }));

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
      if (errorMessage.includes("Incorrect username or password")) {
        return { success: false, message: "Incorrect username or password." };
      } else {
        return { success: false, message: errorMessage };
      }
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
};

export const refreshAccessToken = (
  url: string
): AppThunk<Promise<{ success: boolean; message?: string }>> => async (dispatch) => {
  try {
    const res = await axios.post(
      `${url}/aws-cognito/refresh-token`,
      {},
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;
    const idToken = res.data.idToken;
    const idData = jwtDecode<JWTData>(idToken);

    const user: User = {
      firstName: idData.name || null,
      lastName: idData.family_name || null,
      email: idData.email || null,
      sub: idData.sub || null,
    };

    dispatch(login({ accessToken, user, isAuth: true }));

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message || error.message || 'An unknown error occurred.' };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
};

export const verifyAuthToken = (token: string): AppThunk<Promise<{ success: boolean; message?: string }>> => async (dispatch) => {
  try {
    const authData = jwtDecode<JWTAuthData>(token);

    if (authData.exp && authData.exp > Date.now() / 1000) {
      dispatch(authCheck({ isAuth: true }));
      return { success: true };
    } else {
      dispatch(authCheck({ isAuth: false }));
      const result = await dispatch(refreshAccessToken(import.meta.env.VITE_BACKEND_URL)) as { success: boolean; message?: string };

      if (!result.success) {
        console.error(result.message);
      }

      return result;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message || error.message || 'An unknown error occurred.' };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
};

export const signOut = (): AppThunk<Promise<{ success: boolean; message?: string }>> => async (dispatch) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/aws-cognito/sign-out`, {}, {
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(logout());
      return { success: true };
    }

    return { success: false, message: 'Failed to sign out' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data?.message || error.message || 'An unknown error occurred.' };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
};

export default authReducer;
