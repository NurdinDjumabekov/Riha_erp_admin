///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";

////// style
import "./style.scss";

////// components
import MenuAdmin from "../../common/MenuAdmin/MenuAdmin";

/////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getListWorkShop } from "../../store/reducers/mainSlice";
import { getPointsRouteAgent } from "../../store/reducers/mapSlice";
import { getActiveRouteList } from "../../store/reducers/photoSlice";
import HeaderInfo from "../../common/HeaderInfo/HeaderInfo";

const MainLayouts = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState(true);

  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  // console.log(dataSave, "dataSave");

  useEffect(() => {
    dispatch(getListWorkShop());
    dispatch(getListTA({ first: true }));
    dispatch(getPointsRouteAgent({ guid, first: true }));
    dispatch(getActiveRouteList(guid)); /// только для ТА
    //// отправляю запрос для получения точек каждого агента
  }, []);

  return (
    <div className="layouts">
      <MenuAdmin active={active} setActive={setActive} />
      <HeaderInfo active={active} setActive={setActive} />
      <div className="pages">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayouts;
