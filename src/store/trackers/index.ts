import { createAction, createReducer } from "@reduxjs/toolkit";
import axios from 'axios';
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

interface Symptom {
  id: number;
  symptom_name: string;
}

interface Tracker {
  tracker_name: string;
  symptoms: Symptom[];
  logs: Log[];
}

interface UserPayload {
  trackers: Tracker[];
}

export interface TrackerState {
  trackers: Tracker[];
  selectedTracker: Tracker;
}


// Initial state with an empty array for trackers
const initialState: TrackerState = {
  trackers: [],
  selectedTracker: {
    tracker_name: "",
    symptoms: [],
    logs: [],
  },
}

// Action to set the user data
const getUser = createAction<TrackerState>("GET_USER");
export const updateSelectedTracker = createAction<Tracker>("UPDATE_SELECTED_TRACKER");

// Reducer for managing tracker state
const trackerReducer = createReducer(initialState, (builder) => {
  builder.addCase(getUser, (state, action) => {
    state.trackers = action.payload.trackers;
    state.selectedTracker = action.payload.selectedTracker;
  })
    .addCase(updateSelectedTracker, (state, action) => {
      state.selectedTracker = action.payload;
    });
});

// Async action to fetch user data
export const fetchUser = (accessToken: string): AppThunk => async (dispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/db/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(res.data)


    const obj: UserPayload = res.data;

    const trackers = obj.trackers;
    const stateTracker: Tracker[] = [];

    // Mapping trackers with their corresponding symptoms
    trackers.forEach((tracker) => {
      stateTracker.push({
        tracker_name: tracker.tracker_name,
        symptoms: tracker.symptoms,
        logs: [],
      });
    });

    // Dispatching the getUser action with mapped trackers
    dispatch(getUser({ trackers: stateTracker, selectedTracker: stateTracker[0] }));
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};



export default trackerReducer;
