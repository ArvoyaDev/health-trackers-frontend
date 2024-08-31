import { createAction, createReducer } from "@reduxjs/toolkit";
import axios from 'axios'
const initialState = {
  trackers: [
    {
      illness: null,
      symptoms: null,
      logs: [
        {
          logTime: null,
          severity: null,
          symptoms: [],
          Notes: null,
        }
      ],
    }
  ],
}

const getUser = createAction("GET_USER")

const trackerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getUser, (state, action) => {
      state.trackers = action.payload
    });
});

export const fetchUser = (accessToken: string) => async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/db/user`,
    {
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  console.log(res);
}



export default trackerReducer;
