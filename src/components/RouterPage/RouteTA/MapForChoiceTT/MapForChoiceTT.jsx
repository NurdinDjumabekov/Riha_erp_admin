import React, { useRef, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

///// style
import "./style.scss";

///// fns
import {
  setActiveViewMap,
  editCoordsPoint,
} from "../../../../store/reducers/mapSlice";

///// helpers
import { clearActiveMap } from "../../../../helpers/clear";
import { myAlert } from "../../../../helpers/MyAlert";

////// imgs
import findIcon from "../../../../assets/icons/findMe.svg";

////// env
const { REACT_APP_MAP_KEY } = process.env;

const MapForChoiceTT = () => {
  const dispatch = useDispatch();
  const [listPoints, setListPoints] = useState([]);
  const [input, setInput] = useState([]);

  const mapRef = useRef(null);

  const { activeViewMap } = useSelector((state) => state.mapSlice);
  const { activeTA } = useSelector((state) => state.selectsSlice);

  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAP_KEY,
    libraries: useMemo(() => ["places"], []),
  });

  const handleMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const obj = { ...activeViewMap, lat: coords.lat, lon: coords.lng };
    dispatch(setActiveViewMap(obj));
    setListPoints([{ lat: +coords.lat, lng: +coords.lng }]);
  };

  const saveData = () => {
    if (activeViewMap?.lat && activeViewMap?.lon) {
      const send = {
        ...activeViewMap,
        name: "",
        address: "",
        name_owner: "",
        phone: "",
        type_guid: "0",
        lat: activeViewMap?.lat,
        lon: activeViewMap?.lon,
        point_guid: activeViewMap?.point_guid,
        status: activeViewMap?.status,
        agent_guid: activeTA?.value,
        actionType: 2,
      };
      dispatch(editCoordsPoint(send));
    }
  };

  const findMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            // mapRef.current.setZoom(13);
          }
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
          myAlert("Не удалось определить ваше местоположение.", "error");
        }
      );
    } else {
      alert("Геолокация не поддерживается вашим браузером.");
    }
  };

  const clearRoute = () => dispatch(setActiveViewMap(clearActiveMap));

  useEffect(() => {
    setListPoints([{ lat: +activeViewMap?.lat, lng: +activeViewMap?.lon }]);
  }, []);

  if (loadError) return <p>Ошибка загрузки карты</p>;
  if (!isLoaded) return <p>Загрузка карты...</p>;

  return (
    <div className="mapForChoiceTT">
      <button className="findBtn" onClick={findMe}>
        <img src={findIcon} alt="#" />
      </button>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{
          lat: +activeViewMap?.lat || 42.8508686,
          lng: +activeViewMap?.lon || 74.5975735,
        }}
        zoom={13}
        onClick={handleMapClick}
        onLoad={(map) => (mapRef.current = map)}
        ref={mapRef}
      >
        {listPoints?.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <div className="mapForChoiceTT__actions">
        <button onClick={clearRoute} className="clearMapBtn">
          <p>Закрыть</p>
        </button>
        <button onClick={saveData} className="saveCoords">
          <p>Сохранить</p>
        </button>
      </div>
    </div>
  );
};

export default MapForChoiceTT;
