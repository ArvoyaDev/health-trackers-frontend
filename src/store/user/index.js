const initialState = {
  accessToken: null,
}

export const login = createAction("LOGIN");

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, action) => {
      state.accessToken = action.payload.accessToken;
    })
});

export const signIn = (email, password) => async (dispatch) => {
  try {
    const res = await axios.post(`${VITE_BACKEND_URL}/aws-cognito/sign-in`, {
      email,
      password,
    });

    const accessToken = res.data.accessToken;
    dispatch(login({ accessToken }));
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = () => async (dispatch) => {
  try {
    const res = await axios.post(`${VITE_BACKEND_URL}/aws-cognito/refresh-token`, {
      withCredentials: true,
    });

    const accessToken = res.data.accessToken;
    dispatch(login({ accessToken }));
  } catch (error) {
    console.log(error);
  }
}
