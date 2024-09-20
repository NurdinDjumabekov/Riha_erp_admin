import React, { useEffect, useRef } from "react";

/////// style
import "./style.scss";

////// imgs
import iconNav from "../../assets/icons/arrowMapNav.svg";
import ChoiceDateForMap from "../../components/MapPage/ChoiceDateForMap/ChoiceDateForMap";
import MapWrapper from "../../components/MapPage/MapWrapper/MapWrapper";
import { useState } from "react";

const MapsPage = () => {
  const statusRef = useRef(null); // Для статуса
  const buttonRef = useRef(null); // Для кнопки "Найти меня"

  const [openCateg, setOpenCateg] = useState(false);

  return (
    <div className="map2Gis">
      <button ref={buttonRef} className="btnNavMap">
        <img src={iconNav} alt=">" />
      </button>
      <button className="history" onClick={() => setOpenCateg(true)}>
        Маршруты
      </button>
      <ChoiceDateForMap openCateg={openCateg} setOpenCateg={setOpenCateg} />{" "}
      <MapWrapper statusRef={statusRef} buttonRef={buttonRef} />
    </div>
  );
};

export default MapsPage;
