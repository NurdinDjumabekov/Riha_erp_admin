///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

////// style
import "./style.scss";

////// components
import MenuAgents from "../../common/MenuAgents/MenuAgents";
import MenuAdmin from "../../common/MenuAdmin/MenuAdmin";

/////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getListWorkShop } from "../../store/reducers/mainSlice";

const MainLayouts = () => {
  const dispatch = useDispatch();

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);

  useEffect(() => {
    dispatch(getListWorkShop());
    dispatch(getListTA({ first: true }));
  }, []);

  const objMenu = { 1: <MenuAgents />, 2: <MenuAdmin /> };
  /// user_type - 1 agent 2 admin

  return (
    <div className="layouts">
      <div className="pages">
        <Outlet />
      </div>
      {objMenu?.[user_type]}
    </div>
  );
};

export default MainLayouts;
