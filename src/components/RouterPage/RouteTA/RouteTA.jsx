////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import EveryRouteTA from "./EveryRouteTA/EveryRouteTA";
import EveryRouteListTT from "./EveryRouteListTT/EveryRouteListTT";
import ActionsListRoute from "./ActionsListRoute/ActionsListRoute";
import ActionMapRoute from "./ActionMapRoute/ActionMapRoute";

////// style
import "./style.scss";

////// helpers

////// fns

const RouteTA = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="routeTA">
        <div className="listRoutes">
          <EveryRouteTA />
          {/* список маршрутов */}
          <EveryRouteListTT />
          {/* карта маршрутов */}
        </div>
      </div>
      <ActionsListRoute />
      {/* модалки списка маршрутов */}
      <ActionMapRoute />
      {/* модалки карты маршрутов */}
    </>
  );
};

export default RouteTA;
