////hooks
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// imgs
import iconNav from "../../assets/icons/arrowMapNav.svg";
import AddIcon from "../../assets/MyIcons/AddIcon";

////// components
import ActionsRouteTA from "../../Modals/ActionsRouteTA/ViewRouterTA";
import MapWrapper from "../../components/MapPage/MapWrapper/MapWrapper";
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";

/////// fns
import { getListRoutes_TA } from "../../store/reducers/mapSlice";
import { activeRouteListCRUD } from "../../store/reducers/photoSlice";

////// helpers
import { getMyGeo, transformDateTime } from "../../helpers/transformDate";

///// icons
import CheckIcon from "@mui/icons-material/Check";
import { myAlert } from "../../helpers/MyAlert";

const MapsPage = () => {
  const dispatch = useDispatch();

  const { activeRouteList } = useSelector((state) => state.photoSlice);
  const { guid, user_type } = useSelector(
    (state) => state.saveDataSlice?.dataSave
  );

  const [searchMe, setSearchMe] = useState(false);
  const [closeRoute, setCloseRoute] = useState(false);

  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { activeDate } = useSelector((state) => state.selectsSlice);

  useEffect(() => {
    const obj = { agent_guid: dataSave?.guid, user_type, activeDate };
    dispatch(getListRoutes_TA(obj));
    ///  get данных координат точек для ТА
  }, []);

  const searchMeFN = () => setSearchMe(!searchMe);
  //// для поиска себя на карте

  const startEndListRoute = (type) => {
    if (type == 1) {
      myAlert(`Стартовое время ${transformDateTime(new Date())}`);
    }

    getMyGeo().then(({ lat, lon }) => {
      // начать маршрутный лист
      const data = {
        route_sheet_guid: activeRouteList?.guid,
        start_date: transformDateTime(new Date()),
        end_date: transformDateTime(new Date()),
        comment: "",
        action_type: type, /// / 1 - Старт маршрутного листа, 2 - Конец
        lat,
        lon,
      };
      dispatch(activeRouteListCRUD({ data, guid }));
      setCloseRoute(false);
    });
  };

  const routeEnd = () => myAlert("Вы обошли все точки на сегодня");

  const obj = {
    0: (
      <button className="start" onClick={() => startEndListRoute(1)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Начать путь</p>
      </button>
    ),
    1: (
      <button className="start end" onClick={() => setCloseRoute(true)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Завершить маршрут</p>
      </button>
    ),
    2: (
      <button className="start nice" onClick={routeEnd}>
        <CheckIcon width={16} height={16} color={"#222"} />
      </button>
    ),
  };

  return (
    <>
      <div className="map2Gis">
        <button className="btnNavMap" onClick={searchMeFN}>
          <img src={iconNav} alt=">" />
        </button>
        {obj?.[activeRouteList?.status]}
        <MapWrapper searchMe={searchMe} />
        <ActionsRouteTA />
      </div>
      <ConfirmModal
        state={closeRoute}
        yesFN={() => startEndListRoute(2)}
        noFN={() => setCloseRoute(false)}
        title={"Завершить маршрут ?"}
      />
    </>
  );
};

export default MapsPage;
