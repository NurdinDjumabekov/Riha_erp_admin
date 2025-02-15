import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import { getListTA } from "./mainSlice";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listSales: { sell: [], pickUp: [] }, //pickUp - сколько взял, sell - сколько продал
  reportPays: {}, /// отчет долгов и оплат ТТ для ТА
  reportSummary: { week: [], bc_point: [] }, /// сводный недельный отчет
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

////// getReportPayReq - отчет долгов и оплат ТТ для ТА
export const getReportPayReq = createAsyncThunk(
  "getReportPayReq",
  async function (props, { dispatch, rejectWithValue }) {
    const { agent_guid, date } = props;
    const dateNew = transformActionDate(date);
    const url = `${REACT_APP_API_URL}/ta/agent_point_report?agent_guid=${agent_guid}&date=${dateNew}`;
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

////// getListProdsPointReq - get список товаров, которые ТА продал какой-то точке
export const getListProdsPointReq = createAsyncThunk(
  "getListProdsPointReq",
  async function (props, { dispatch, rejectWithValue }) {
    const { point_guid, date } = props;
    const url = `${REACT_APP_API_URL}/ta/report_sale_point?point_guid=${point_guid}&date=${date}`;
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

////// getReportSummaryWeek - get недельный сводный отчет
export const getReportSummaryWeek = createAsyncThunk(
  "getReportSummaryWeek",
  async function (props, { dispatch, rejectWithValue }) {
    const { from, to, agent_guid } = props;
    const url = `${REACT_APP_API_URL}/ta/report_summary?agent_guid=${agent_guid}&from=${from}&to=${to}`;
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

    ///////////////// getReportPayReq
    builder.addCase(getReportPayReq.fulfilled, (state, action) => {
      state.preloader = false;
      state.reportPays = action.payload;
    });
    builder.addCase(getReportPayReq.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.reportPays = {};
    });
    builder.addCase(getReportPayReq.pending, (state, action) => {
      state.preloader = true;
    });

    ///////////////// getReportSummaryWeek
    builder.addCase(getReportSummaryWeek.fulfilled, (state, action) => {
      state.preloader = false;
      const ft_point = action.payload?.ft_point?.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      const market_point = action.payload?.market_point?.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      const bs_point = action.payload?.bs_point?.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      state.reportSummary = {
        ...action.payload,
        ft_point,
        market_point,
        bs_point,
      };
    });
    builder.addCase(getReportSummaryWeek.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.reportSummary = {};
    });
    builder.addCase(getReportSummaryWeek.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const { setDebtEveryTA } = reportsSlice.actions;

export default reportsSlice.reducer;
