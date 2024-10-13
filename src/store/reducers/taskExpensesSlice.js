import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listTasks: [], /// список задач
  listSpending: [], /// список трат
  listSpendingTA: [], /// список трат ТА
};
/////////////////////////////////////////////////////// tasks
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
      const response = await axios.post(url, data);
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

////// addFileInTasks - добавление файлов в списки задач
export const addFileInTasks = createAsyncThunk(
  "addFileInTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/+++++++++++++`;
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

////// delFileInTasks - добавление файлов в списки задач
export const delFileInTasks = createAsyncThunk(
  "delFileInTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/+++++++++++++`;
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

/////////////////////////////////////////////////////// траты ТА
////// getListSpending - get список возможных трат
export const getListSpending = createAsyncThunk(
  "getListSpending",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_expense_type`;
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

////// getListSpendingTA - get список возможных трат
export const getListSpendingTA = createAsyncThunk(
  "getListSpendingTA",
  async function (props, { dispatch, rejectWithValue }) {
    const { user_guid, expense_type_guid } = props;
    const url = `${REACT_APP_API_URL}/ta/get_expenses?user_guid=${user_guid}&date=2024-10-10&expense_type_guid=${expense_type_guid}`;
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

    ////////////// getListSpending
    builder.addCase(getListSpending.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSpending = action.payload;
    });
    builder.addCase(getListSpending.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListSpending.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setListTasks } = taskExpensesSlice.actions;

export default taskExpensesSlice.reducer;
