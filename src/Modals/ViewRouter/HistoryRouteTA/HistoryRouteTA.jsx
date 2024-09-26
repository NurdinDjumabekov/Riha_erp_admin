////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import MapHistory from "../MapHistory/MapHistory";

////// helpers

////// fns

////// style
import "./style.scss";
import { getListTA } from "../../../store/reducers/mainSlice";

const HistoryRouteTA = () => {
  const dispatch = useDispatch();

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  useEffect(() => {
    dispatch(getListTA({ first: true }));
  }, []);

  return (
    <>
      <div className="historyRouteTA">
        <MapHistory />
      </div>
    </>
  );
};

export default HistoryRouteTA;
