import { createAction, createReducer } from "@reduxjs/toolkit";
import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { RootState } from '../../store/';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

interface Log {
  log_time: string | null;
  severity: string | null;
  symptoms: string[];
  notes: string | null;
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
export const addLog = createAction<Log>("ADD_LOG");

export const updateSelectedTracker = createAction<Tracker>("UPDATE_SELECTED_TRACKER");

// Reducer for managing tracker state
const trackerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getUser, (state, action) => {
      state.trackers = action.payload.trackers;
      state.selectedTracker = action.payload.selectedTracker;
    })
    .addCase(updateSelectedTracker, (state, action) => {
      state.selectedTracker = action.payload;
    })
    .addCase(addLog, (state, action) => {
      state.selectedTracker.logs.push(action.payload);
      state.trackers = state.trackers.map((tracker) => {
        if (tracker.tracker_name === state.selectedTracker.tracker_name) {
          return state.selectedTracker;
        }
        return tracker;
      });
    });

});

// Async action to fetch user data
//
export const fetchUser = (accessToken: string): AppThunk<Promise<{ success: boolean; message?: string }>> => async (dispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/db/user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const obj: UserPayload = res.data;

    const trackers = obj.trackers;
    const stateTracker: Tracker[] = [];

    // Mapping trackers with their corresponding symptoms
    trackers.forEach((tracker) => {
      if (tracker.logs === null) {
        tracker.logs = [];
      }
      stateTracker.push({
        tracker_name: tracker.tracker_name,
        symptoms: tracker.symptoms,
        logs: tracker.logs,
      });
    });

    // Dispatching the getUser action with mapped trackers
    dispatch(getUser({ trackers: stateTracker, selectedTracker: stateTracker[0] }));

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error
      return { success: false, message: error.message };
    } else {
      // Handle unexpected errors
      return { success: false, message: 'An unexpected error occurred' };
    }
  }
};



export default trackerReducer;
