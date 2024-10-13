import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listTasks: [], /// список задач
};

////// getTasks - get список задач
export const getTasks = createAsyncThunk(
  "getTasks",
  async function (props, { dispatch, rejectWithValue }) {
    const { agent_guid, date_from, date_to, point_guid } = props;
    const url = `${REACT_APP_API_URL}/ta/get_tasks?agent_guid=${agent_guid}&date=${date_from}&point_guid=${point_guid}&is_admin`;
    try {
      const response = await axios(url);
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

////// createTasks - cоздание списка задач
export const createTasks = createAsyncThunk(
  "createTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/create_task`;
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

////// editTasks - изменение данных в списке задач
export const editTasks = createAsyncThunk(
  "editTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/update_task`;
    try {
      const response = await axiosInstance.put(url, data);
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

////// changeStatusTasks - изменение статуса списка задач
export const changeStatusTasks = createAsyncThunk(
  "changeStatusTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/update_task_status`;
    try {
      const response = await axios.put(url, data);
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

const taskExpensesSlice = createSlice({
  name: "taskExpensesSlice",
  initialState,
  reducers: {
    setListTasks: (state, action) => {
      state.listTasks = action?.payload;
    },
  },

  extraReducers: (builder) => {
    ////////////// getTasks
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.preloader = false;
      state.listTasks = action.payload;
    });
    builder.addCase(getTasks.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getTasks.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setListTasks } = taskExpensesSlice.actions;

export default taskExpensesSlice.reducer;
