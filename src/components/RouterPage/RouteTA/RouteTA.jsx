////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

////// components

////// style
import "./style.scss";
import EveryRouteTA from "./EveryRouteTA/EveryRouteTA";
import EveryRouteListTT from "./EveryRouteListTT/EveryRouteListTT";
import ActionsListRoute from "./ActionsListRoute/ActionsListRoute";
import ActionMapRoute from "./ActionMapRoute/ActionMapRoute";

////// helpers

////// fns

const RouteTA = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="routeTA">
        <div className="listRoutes">
          <EveryRouteTA />
          <EveryRouteListTT />
        </div>
      </div>
      <ActionsListRoute />
      <ActionMapRoute />
    </>
  );
};

export default RouteTA;
