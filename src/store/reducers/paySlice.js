import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import { getListTA } from "./mainSlice";
import axiosInstance from "../../axiosInstance";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  debtEveryTA: { vozvrat: [], dolg: [] }, /// долг каждого агента
};

////// getEveryDebt - get список долгов каждого ТА
export const getEveryDebt = createAsyncThunk(
  "getEveryDebt",
  async function ({ agent_guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/account?agent_guid=${agent_guid}`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        dispatch(getListTA({ first: false }));
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// payTA - оплата ТА
export const payTA = createAsyncThunk(
  "payTA",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/add_oplata`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paySlice = createSlice({
  name: "paySlice",
  initialState,
  reducers: {
    setDebtEveryTA: (state, action) => {
      state.debtEveryTA = action?.payload;
    },
  },
  extraReducers: (builder) => {
    ////////////// getEveryDebt
    builder.addCase(getEveryDebt.fulfilled, (state, action) => {
      state.preloader = false;
      state.debtEveryTA = action.payload;
    });
    builder.addCase(getEveryDebt.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getEveryDebt.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setDebtEveryTA } = paySlice.actions;

export default paySlice.reducer;
