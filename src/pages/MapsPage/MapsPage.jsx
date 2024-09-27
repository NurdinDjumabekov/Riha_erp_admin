////hooks
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// imgs
import iconNav from "../../assets/icons/arrowMapNav.svg";

////// components
import ActionsRouteTA from "../../Modals/ActionsRouteTA/ViewRouterTA";
import MapWrapper from "../../components/MapPage/MapWrapper/MapWrapper";

/////// fns
import { getListRoutes_TA } from "../../store/reducers/mapSlice";
import AddIcon from "../../assets/MyIcons/AddIcon";
import { activeRouteListCRUD } from "../../store/reducers/photoSlice";
import { transformDateTime } from "../../helpers/transformDate";

///// icons

const MapsPage = () => {
  const dispatch = useDispatch();

  const { activeActions_TA } = useSelector((state) => state.mapSlice);
  const { activeRouteList } = useSelector((state) => state.photoSlice);
  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);

  const [searchMe, setSearchMe] = useState(false);

  const { dataSave } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    dispatch(getListRoutes_TA(dataSave?.guid)); ///  get данных координат точек для ТА
  }, []);

  const searchMeFN = () => setSearchMe(!searchMe);
  //// для поиска себя на карте

  console.log(activeRouteList, "activeRouteList");

  const startEndListRoute = (type) => {
    //// начать маршрутный лист
    const data = {
      route_sheet_guid: activeRouteList?.guid,
      start_date: transformDateTime(new Date()),
      end_date: transformDateTime(new Date()),
      comment: "",
      action_type: type, /// / 1 - Старт марщшуртного листа, 2 - Конец
    };
    dispatch(activeRouteListCRUD({ data, guid }));
  };

  const obj = {
    0: (
      <button className="start" onClick={() => startEndListRoute(1)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Начать путь</p>
      </button>
    ),
    1: (
      <button className="start end" onClick={() => startEndListRoute(2)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Завершить путь</p>
      </button>
    ),
  };

  return (
    <div className="map2Gis">
      <button className="btnNavMap" onClick={searchMeFN}>
        <img src={iconNav} alt=">" />
      </button>
      {obj?.[activeRouteList?.status]}
      <MapWrapper searchMe={searchMe} />
      <ActionsRouteTA />
    </div>
  );
};

export default MapsPage;
