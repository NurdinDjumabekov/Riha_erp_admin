import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearAddPoints, clearPositionPoints } from "../../helpers/clear";
import axios from "axios";
import axiosInstance from "../../axiosInstance";
import { myAlert } from "../../helpers/MyAlert";
import { setStateLoad } from "./mapSlice";

const { REACT_APP_API_URL, REACT_APP_MAP_KEY } = process.env;

const initialState = {};

//// обе апи на будущее
////// addNewPonts - создаю новую точку от имени ТА
export const addNewPonts = createAsyncThunk(
  "addNewPonts",
  async function (props, { dispatch, rejectWithValue }) {
    const data = {
      type_guid: "85DB5D34-2FB5-45EA-849F-97BF11BC2E4C", //// timmmms
      ...props,
      lat: props?.lon,
      lon: props?.lat,
    };
    const url = `${REACT_APP_API_URL}/ta/create_point`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.result == 1) {
          dispatch(setStateLoad()); // (нужен для перезагрузки карт)
        }
        return {
          result: response.data?.result,
          navigate: props?.navigate,
        };
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// addNewPontToday - добавляю новую точку на сегодняшний день
export const addNewPontToday = createAsyncThunk(
  "addNewPontToday",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/add_route_agent`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.result == 1) {
          myAlert("Новый маршрут был построен");
          data?.navigate("/maps");
          dispatch(setStateLoad()); // (нужен для перезагрузки карт)
        }
        if (response.data?.result == 0) {
          myAlert("Маршрут с такой точкой уже построен!", "error");
        }
        return response.data?.result;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const pointsSlice = createSlice({
  name: "pointsSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {},
});

export const {} = pointsSlice.actions;

export default pointsSlice.reducer;
