////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListsWareHome from "../../components/WareHomePage/ListsActions/ListsWareHome";
import ListsSendTA from "../../components/WareHomePage/ListsActions/ListsSendTA";
import HistoryInvoice from "../../components/WareHomePage/HistoryInvoice/HistoryInvoice";

////// fns
import { getListWorkShopWH } from "../../store/reducers/wareHouseSlice";
import { getListTAForWH } from "../../store/reducers/wareHouseSlice";
import { clearAllWareHome } from "../../store/reducers/wareHouseSlice";

import { setActiveTA } from "../../store/reducers/selectsSlice";

////// helpers
import { menuSGP } from "../../helpers/LocalData";

////// style
import "./style.scss";

const WareHomePage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState(1);

  useEffect(() => {
    dispatch(getListWorkShopWH());
    dispatch(getListTAForWH());
    /// для получения категшорий , цехов и товаров (внутри еще 2 функции есть)

    return () => {
      dispatch(clearAllWareHome());
      dispatch(setActiveTA({}));
    };
  }, []);

  const obj = {
    1: (
      <div className="wareHomePage__invoice">
        <ListsWareHome /> <ListsSendTA />
      </div>
    ),
    2: <HistoryInvoice />,
  };

  return (
    <div className="wareHomePage">
      <div className="wareHomePage__menu">
        {menuSGP?.map((i) => (
          <button
            className={i?.id == active ? "active" : ""}
            onClick={() => setActive(i.id)}
            key={i.id}
          >
            {i?.icons}
            <p>{i?.name}</p>
          </button>
        ))}
      </div>
      {obj?.[active]}
    </div>
  );
};

export default WareHomePage;
