///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

////// style
import "./style.scss";

////// components
import MenuAdmin from "../../common/MenuAdmin/MenuAdmin";

/////// fns
import {
  getListTA,
  mainActiveCheckBoxTA_FN,
} from "../../store/reducers/mainSlice";
import { getListWorkShop } from "../../store/reducers/mainSlice";
import { getPointsRouteAgent } from "../../store/reducers/mapSlice";
import { getActiveRouteList } from "../../store/reducers/photoSlice";
import HeaderInfo from "../../common/HeaderInfo/HeaderInfo";
import { activeAgentFN } from "../../store/reducers/standartStateSlice";

const MainLayouts = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  // console.log(pathname, "location");

  const [active, setActive] = useState(true);

  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { activeDateDay } = useSelector((state) => state.standartStateSlice);
  const { activeAgent } = useSelector((state) => state.standartStateSlice);

  // console.log(activeDateDay, "activeDateDay");
  // console.log(activeAgent, "activeAgent");

  useEffect(() => {
    getStartData();
    getAgents();
  }, []);

  const getAgents = async () => {
    const list = await dispatch(getListTA()).unwrap();
    dispatch(activeAgentFN(list?.[9]));
  };

  const getStartData = async () => {
    // dispatch(getListWorkShop());
    // dispatch(getPointsRouteAgent({ guid, first: true }));
    // dispatch(getActiveRouteList(guid)); /// только для ТА
    //// отправляю запрос для получения точек каждого агента
  };

  return (
    <div className="layouts">
      <MenuAdmin active={active} setActive={setActive} />
      {/* <HeaderInfo active={active} setActive={setActive} /> */}
      <div className="pagesAll">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayouts;
