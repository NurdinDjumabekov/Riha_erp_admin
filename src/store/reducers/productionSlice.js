import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { getListOrders, setInvoiceInfo } from "./mainSlice";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import { setActiveTA } from "./selectsSlice";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listProduction: [], /// список товаров в производстве
  activeDate: "2024-09-14",
};

////// getListProdProduction - get список товаров производства
export const getListProdProduction = createAsyncThunk(
  "getListProdProduction",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_production_invoice`;
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

////// sendInWareHomeFN - отправка товаров на склад
export const sendInWareHomeFN = createAsyncThunk(
  "sendInWareHomeFN",
  async function (props, { dispatch, rejectWithValue }) {
    const { data, listTA, activeDate } = props;
    const url = `${REACT_APP_API_URL}/ta/update_production_invoice`;
    try {
      const response = await axiosInstance.put(url, data);
      if (response.status >= 200 && response.status < 300) {
        const obj = { guid: "", action: 0, listInvoice: [] };
        dispatch(setInvoiceInfo(obj)); /// для закрытия модалки
        myAlert("Список товаров отправлен на склад");

        const agents_guid = searchActiveOrdersTA(listTA);
        dispatch(getListOrders({ ...activeDate, agents_guid }));
        /// обновление данных календаря
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListWorkShop - get список цехов
// export const getListWorkShop = createAsyncThunk(
//   "getListWorkShop",
//   async function (props, { dispatch, rejectWithValue }) {
//     const url = `${REACT_APP_API_URL}/ta/get_workshop`;
//     try {
//       const response = await axios(url);
//       if (response.status >= 200 && response.status < 300) {
//         const obj = response?.data?.[0];
//         dispatch(getListCategs(obj)); /// для получение категорий

//         const objSort = { value: obj?.guid, label: obj.name };
//         dispatch(setActiveWorkShop({ ...obj, ...objSort }));
//         ///// подставляю активныый селект в state
//         return response?.data;
//       } else {
//         throw Error(`Error: ${response.status}`);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// ////// getListCategs - get список категорий
// export const getListCategs = createAsyncThunk(
//   "getListCategs",
//   async function ({ guid }, { dispatch, rejectWithValue }) {
//     const url = `${REACT_APP_API_URL}/ta/get_category?workshop_guid=${guid}`;
//     try {
//       const response = await axiosInstance(url);
//       if (response.status >= 200 && response.status < 300) {
//         const obj = response?.data?.[0];
//         dispatch(getListProds({ guid, guidCateg: obj?.category_guid }));
//         /// для получение товаров
//         const objSort = {
//           value: obj?.category_guid,
//           label: obj?.category_name,
//         };
//         dispatch(setActiveCategs({ ...obj, ...objSort }));
//         ///// подставляю активный селект в state
//         return response?.data;
//       } else {
//         throw Error(`Error: ${response.status}`);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

const productionSlice = createSlice({
  name: "productionSlice",
  initialState,
  reducers: {
    setListProduction: (state, action) => {
      state.listProduction = action.payload;
    },

    /////изменение ключа count в списке товаров производства
    changeCountProduction: (state, action) => {
      const { product_guid, count } = action.payload;
      state.listProduction = state.listProduction?.map((i) =>
        i?.product_guid === product_guid ? { ...i, count } : i
      );
    },
  },

  extraReducers: (builder) => {
    ////////////// getListProdProduction
    builder.addCase(getListProdProduction.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProduction = action.payload?.map((i) => ({
        ...i,
        countOld: i.count,
      }));
    });
    builder.addCase(getListProdProduction.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListProdProduction.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const { setListProduction, changeCountProduction } =
  productionSlice.actions;

export default productionSlice.reducer;
