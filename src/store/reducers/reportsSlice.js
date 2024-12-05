import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import { getListTA } from "./mainSlice";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listSales: { sell: [], pickUp: [] }, //pickUp - сколько взял, sell - сколько продал
};

////// getSaleAgentReq - get список товаров, которые ТА продал за какаю-то дату
export const getSaleAgentReq = createAsyncThunk(
  "getSaleAgentReq",
  async function (props, { dispatch, rejectWithValue }) {
    const { agent_guid, date } = props;
    const dateNew = transformActionDate(date);
    const url = `${REACT_APP_API_URL}/ta/report_sale?agent_guid=${agent_guid}&date=${dateNew}`;
    try {
      const response = await axiosInstance(url);
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

const reportsSlice = createSlice({
  name: "reportsSlice",
  initialState,
  reducers: {
    setDebtEveryTA: (state, action) => {
      state.debtEveryTA = action?.payload;
    },
  },
  extraReducers: (builder) => {
    ////////////// getSaleAgentReq
    builder.addCase(getSaleAgentReq.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSales = action.payload;
    });
    builder.addCase(getSaleAgentReq.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listSales = { sell: [], pickUp: [] };
    });
    builder.addCase(getSaleAgentReq.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setDebtEveryTA } = reportsSlice.actions;

export default reportsSlice.reducer;
