////// hooks
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

////// fns
import { setInvoiceInfo } from "../../store/reducers/mainSlice";
import { getListTA } from "../../store/reducers/mainSlice";
import { clearSelects } from "../../store/reducers/selectsSlice";

////// style
import "./style.scss";

////// helpers
import { listActionRoute } from "../../helpers/objs";

////// components
import ViewAgents from "../../components/RouterPage/ViewAgents/ViewAgents";
import RouteTA from "../../components/RouterPage/RouteTA/RouteTA";
import HistoryRouteTA from "../../components/RouterPage/HistoryRouteTA/HistoryRouteTA";

const RouterPage = () => {
  const dispatch = useDispatch();
  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  const [active, setActive] = useState(1);

  useEffect(() => {
    dispatch(getListTA({ first: true }));

    return () => {
      dispatch(clearSelects());
    };
  }, [invoiceInfo?.action, dispatch]);

  const obj = { 1: <ViewAgents />, 2: <RouteTA />, 3: <HistoryRouteTA /> };

  return (
    <div className="routerPage">
      <div className="routerPage__inner">
        <div className="listActions">
          <div className="listActions__inner">
            {listActionRoute?.map((i) => (
              <button
                onClick={() => setActive(i.id)}
                className={active == i.id ? "active" : ""}
                key={i?.id}
              >
                {i?.icon}
                <p>{i?.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {obj?.[active]}
    </div>
  );
};

export default RouterPage;
