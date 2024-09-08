import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataSave: { guid: "", fio: "", user_type: "" },
};

const saveDataSlice = createSlice({
  name: "saveDataSlice",
  initialState,
  reducers: {
    setDataSave: (state, action) => {
      state.dataSave = action.payload;
    },
  },
});
export const { setDataSave } = saveDataSlice.actions;

export default saveDataSlice.reducer;
