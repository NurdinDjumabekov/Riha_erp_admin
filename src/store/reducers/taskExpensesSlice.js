import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

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

////// addFileInTasks - добавление файлов в списки задач
export const addFileInTasks = createAsyncThunk(
  "addFileInTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/add_file`;
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

////// delFileInTasks - добавление файлов в списки задач
export const delFileInTasks = createAsyncThunk(
  "delFileInTasks",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/del_file`;
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
    const { active, dateRange } = props;
    const date_to = transformActionDate(dateRange?.[1]);
    const date_from = transformActionDate(dateRange?.[0]);
    const url = `${REACT_APP_API_URL}/ta/get_expenses?user_guid=${active}&date_to=${date_to}&date_from=${date_from}`;
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

////// createSpending - cоздание расходов
export const createSpending = createAsyncThunk(
  "createSpending",
  async function (props, { dispatch, rejectWithValue }) {
    const data = {
      amount: props?.amount,
      comment: props?.comment,
      user_guid: props?.active,
      user_type: 1, /// всегда 1 т.к. только ТА создают траты
      expense_type_guid: props.spending?.value,
    };
    const url = `${REACT_APP_API_URL}/ta/add_expense`;
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

////// delSpending - удаление расходов
export const delSpending = createAsyncThunk(
  "delSpending",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/del_expense`;
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

////// changeSpendingStatus - изменение статуса списка задач
export const changeSpendingStatus = createAsyncThunk(
  "changeSpendingStatus",
  async function (props, { dispatch, rejectWithValue }) {
    const data = { ...props, status: props?.status?.value };
    const url = `${REACT_APP_API_URL}/ta/expense_status`;
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

    /////////////// getListSpendingTA
    builder.addCase(getListSpendingTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSpendingTA = action.payload;
    });
    builder.addCase(getListSpendingTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListSpendingTA.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setListTasks } = taskExpensesSlice.actions;

export default taskExpensesSlice.reducer;
