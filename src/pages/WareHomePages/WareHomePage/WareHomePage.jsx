////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListOrdersTA from "../../../components/WareHomePages/ListOrdersTA/ListOrdersTA";

////// fns

import { setActiveTA } from "../../../store/reducers/selectsSlice";

////// helpers

////// style
import "./style.scss";

const WareHomePage = () => {
  const dispatch = useDispatch();

  const getData = () => {};

  useEffect(() => {}, []);

  return (
    <div className="wareHomePage">
      <ListOrdersTA />
    </div>
  );
};

export default WareHomePage;
