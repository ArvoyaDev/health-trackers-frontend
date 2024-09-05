import { createAction, createReducer } from "@reduxjs/toolkit";
import axios from 'axios'
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  void,
  unknown,
  Action<string>
>;

interface Log {
  logTime: string | null;
  severity: string | null;
  symptoms: string[];
  Notes: string | null;
}

interface Tracker {
  illness: string | null;
  symptoms: string | null;
  logs: Log[];
}

interface TrackerState {
  trackers: Tracker[];
}


const initialState: TrackerState = {
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

const getUser = createAction<TrackerState>("GET_USER")

const trackerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getUser, (state, action) => {
      state.trackers = action.payload
    });
});

export const fetchUser = (accessToken: string): AppThunk => async (dispatch) => {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/db/user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

}



export default trackerReducer;
