////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import MapHistory from "./MapHistory/MapHistory";

////// helpers

////// fns
import { getListTA } from "../../../store/reducers/mainSlice";
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import { clearSelects } from "../../../store/reducers/selectsSlice";
import { getListRoutes_TA } from "../../../store/reducers/mapSlice";
import { setListPhotos } from "../../../store/reducers/photoSlice";
import { getActiveRouteList } from "../../../store/reducers/photoSlice";

////// style
import "./style.scss";

const HistoryRouteTA = () => {
  const dispatch = useDispatch();

  const { activeDate } = useSelector((state) => state.selectsSlice);
  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);

  const getData = async () => {
    try {
      dispatch(setListPhotos());
      const list = await dispatch(getListTA({ first: true })).unwrap();
      const obj = { label: list?.[39]?.fio, value: list?.[39]?.guid };
      dispatch(setActiveTA(obj));
      const data = { agent_guid: list?.[39]?.guid, user_type, activeDate };
      await dispatch(getListRoutes_TA(data)).unwrap(); // get историю маршрутов
      await dispatch(getActiveRouteList(list?.[39]?.guid)).unwrap();
      //// отправляю запрос для получения точек каждого агента
    } catch (error) {}
  };

  useEffect(() => {
    getData();
    return () => dispatch(clearSelects());
  }, []);

  return (
    <div className="historyRouteTA">
      <MapHistory />
    </div>
  );
};

export default HistoryRouteTA;
