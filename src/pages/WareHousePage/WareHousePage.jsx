/////// hooks
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState, useEffect } from "react";

////// components

/////// style
import "./style.scss";

////// helpers

////// fns
const WareHousePage = () => {
  const dispatch = useDispatch();

  const calendarRef = useRef(null);

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { listOrders, activeDate } = useSelector((state) => state.mainSlice);
  const { listTitleOrders } = useSelector((state) => state.mainSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  const addTodo = (selectInfo) => {};

  useEffect(() => {}, []);

  return (
    <div className="wareHousePage">
      <div className="wareHousePage__inner"></div>
    </div>
  );
};

export default WareHousePage;
