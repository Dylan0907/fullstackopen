import { createSlice } from "@reduxjs/toolkit";

const FilterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    setFilter(state, action) {
      state = action.payload;
      return state;
    }
  }
});
export const filterChange = (filter) => {
  return async (dispatch) => {
    dispatch(setFilter(filter));
  };
};
export const { setFilter } = FilterSlice.actions;
export default FilterSlice.reducer;
