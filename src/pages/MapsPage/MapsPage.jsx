import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// imgs
import iconNav from "../../assets/icons/arrowMapNav.svg";

////// components
import ChoiceDateForMap from "../../components/MapPage/ChoiceDateForMap/ChoiceDateForMap";
import MapWrapper from "../../components/MapPage/MapWrapper/MapWrapper";

///// icons
import CloseIcon from "@mui/icons-material/Close";
import {
  getPointsRouteAgent,
  setListRouteEveryTA,
} from "../../store/reducers/mapSlice";

const MapsPage = () => {
  const dispatch = useDispatch();

  const statusRef = useRef(null); // Для статуса
  const buttonRef = useRef(null); // Для кнопки "Найти меня"

  const [openCateg, setOpenCateg] = useState(false);

  const { listRouteEveryTA } = useSelector((state) => state.mapSlice);
  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);

  console.log(listRouteEveryTA, "listRouteEveryTA");

  const clearRoutesTA = () => {
    dispatch(setListRouteEveryTA([]));
    //// очистка координат у ТА
    dispatch(getPointsRouteAgent({ guid }));
    //// отправляю запрос для получения точек каждого агента
  };

  return (
    <div className="map2Gis">
      <button ref={buttonRef} className="btnNavMap">
        <img src={iconNav} alt=">" />
      </button>
      <div className="history">
        <button onClick={() => setOpenCateg(true)}>Маршруты</button>
        {listRouteEveryTA?.length !== 0 && (
          <button onClick={clearRoutesTA} className="closeroutes">
            <CloseIcon />
          </button>
        )}
      </div>
      <ChoiceDateForMap openCateg={openCateg} setOpenCateg={setOpenCateg} />{" "}
      <MapWrapper statusRef={statusRef} buttonRef={buttonRef} />
    </div>
  );
};

export default MapsPage;
