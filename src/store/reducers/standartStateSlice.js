import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import { getListTA } from "./mainSlice";
import axiosInstance from "../../axiosInstance";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  activeDateDay: format(new Date(), "yyyy-MM-dd", { locale: ru }),
  activeSearchAgents: "",
  activeAgent: {},
};

const standartStateSlice = createSlice({
  name: "standartStateSlice",
  initialState,
  reducers: {
    activeDateDayFN: (state, action) => {
      state.activeDateDay = action?.payload;
    },
    activeSearchAgentsFN: (state, action) => {
      state.activeSearchAgents = action?.payload;
    },
    activeAgentFN: (state, action) => {
      state.activeAgent = action?.payload;
    },
  },
});

export const { activeDateDayFN, activeSearchAgentsFN, activeAgentFN } =
  standartStateSlice.actions;

export default standartStateSlice.reducer;
