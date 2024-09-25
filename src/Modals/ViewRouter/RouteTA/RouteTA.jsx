////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

////// components
import MapForChoicePoints from "../MapForChoicePoints/MapForChoicePoints";

////// style
import "./style.scss";

////// helpers
import { transformLists } from "../../../helpers/transformLists";

////// fns
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import EveryRouteTA from "../EveryRouteTA/EveryRouteTA";
import ActionsListRoute from "../ActionsListRoute/ActionsListRoute";
import EveryRouteListTT from "../EveryRouteListTT/EveryRouteListTT";

const RouteTA = () => {
  const dispatch = useDispatch();

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);
  const { listRoadRouteEveryTA } = useSelector((state) => state.mapSlice);

  return (
    <>
      <div className="routeTA">
        <div className="listRoutes">
          <EveryRouteTA />
          <EveryRouteListTT />
        </div>
      </div>
      <ActionsListRoute />
    </>
  );
};

export default RouteTA;
{
  /* <MapForChoicePoints /> */
}
