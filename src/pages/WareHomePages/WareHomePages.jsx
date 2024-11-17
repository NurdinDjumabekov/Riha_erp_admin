////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

////// components
import WareHomePage from "./WareHomePage/WareHomePage";
import OrdersWH_Page from "./OrdersWH_Page/OrdersWH_Page";

////// fns
import {
  activeOrderFN,
  getListOrdersWH_Req,
} from "../../store/reducers/wareHouseSlice";

const WareHomePages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeSort } = useSelector((state) => state.wareHouseSlice);

  const getData = async () => {
    const res = await dispatch(getListOrdersWH_Req(activeSort)).unwrap();
    /// get список заказов от ТА для отпуска
    dispatch(activeOrderFN(res?.[0]));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<WareHomePage />} />
      <Route path="/orders" element={<OrdersWH_Page />} />
    </Routes>
  );
};

export default WareHomePages;
