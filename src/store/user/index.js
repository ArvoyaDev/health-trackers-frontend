import { createAction, createReducer } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const initialState = {
  accessToken: null,
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    sub: null,
  },
}


export const login = createAction("LOGIN");

const tokenReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    })
});

export const signIn = (username, password, url) => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/sign-in`, {
      username,
      password,
    });
    console.log("THIS IS RESPONE DATA " + res.data);
    console.log("RESPONSE HEADERS: ", res.headers);

    const idToken = res.data.idToken;
    const idData = jwtDecode(idToken);
    const user = {
      firstName: idData.name,
      lastName: idData.family_name,
      email: idData.email,
      sub: idData.sub,
    }
    dispatch(login({ accessToken: idToken, user }));
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = (url) => async (dispatch) => {
  try {
    const res = await axios.post(`${url}/aws-cognito/refresh-token`, {
      withCredentials: true,
    });
    const idToken = res.data.idToken;
    const idData = jwtDecode(idToken);
    const user = {
      firstName: idData.name,
      lastName: idData.family_name,
      email: idData.email,
      sub: idData.sub,
    }
    dispatch(login({ accessToken: idToken, user }));
  } catch (error) {
    console.log(error);
  }
}

export default tokenReducer;
