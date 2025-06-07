import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    }
  }
});

export const setNotification = (notification, time) => {
  return async (dispatch) => {
    dispatch(changeNotification(notification));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export const { changeNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
