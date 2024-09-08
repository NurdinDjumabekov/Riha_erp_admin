import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

//// slice
import stateSlice from "./reducers/stateSlice";
import saveDataSlice from "./reducers/saveDataSlice";
import requestSlice from "./reducers/requestSlice";
import selectsSlice from "./reducers/selectsSlice";

const reducer = combineReducers({
  requestSlice,
  stateSlice,
  saveDataSlice,
  selectsSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["saveDataSlice"],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export { store };
