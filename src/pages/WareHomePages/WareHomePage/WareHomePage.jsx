////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListsWareHome from "../../../components/WareHomePage/ListsActions/ListsWareHome";
import ListsSendTA from "../../../components/WareHomePage/ListsActions/ListsSendTA";
import HistoryInvoice from "../../../components/WareHomePage/HistoryInvoice/HistoryInvoice";
import ListOrdersTA from "../../../components/WareHomePages/ListOrdersTA/ListOrdersTA";

////// fns
import {
  getListOrdersWH_Req,
  getListWorkShopWH,
} from "../../../store/reducers/wareHouseSlice";
import { clearAllWareHome } from "../../../store/reducers/wareHouseSlice";

import { setActiveTA } from "../../../store/reducers/selectsSlice";

////// helpers

////// style
import "./style.scss";

const WareHomePage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState(1);

  const getData = () => {
    dispatch(getListWorkShopWH());
    /// для получения категшорий , цехов и товаров (внутри еще 2 функции есть)
  };

  useEffect(() => {
    getData();
    return () => {
      dispatch(clearAllWareHome());
      dispatch(setActiveTA({}));
    };
  }, []);

  // const obj = {
  //   1: (
  //     <div className="wareHomePage__invoice">
  //       <ListsWareHome /> <ListsSendTA getData={getData} />
  //     </div>
  //   ),
  //   2: <HistoryInvoice />,
  // };
  //// delete

  return (
    <div className="wareHomePage">
      <ListOrdersTA />
    </div>
  );
};

export default WareHomePage;
