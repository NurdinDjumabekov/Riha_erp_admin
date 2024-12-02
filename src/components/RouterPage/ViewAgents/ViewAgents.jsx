////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef, useMemo } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

////// styles
import "./style.scss";

////// imgs
import findIcon from "../../../assets/icons/findMe.svg";

////// fns
import { getListTA } from "../../../store/reducers/mainSlice";
import { getAllRouteAgent } from "../../../store/reducers/mapSlice";

//// components
import CustomMarker from "../CustomMarker/CustomMarker";

////// helpers
const { REACT_APP_MAP_KEY } = process.env;

const ViewAgents = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  const libraries = useMemo(() => ["places"], []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAP_KEY,
    libraries,
  });

  const [center, setCenter] = useState({ lat: 42.8540827, lng: 74.6283202 });
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    let intervalId;
    const getRoute = async () => {
      const routes = await dispatch(getAllRouteAgent()).unwrap();
      setMarkers(routes);
    };

    dispatch(getListTA({ first: true }));
    intervalId = setInterval(getRoute, 15000);
    getRoute();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [invoiceInfo?.action, dispatch]);

  const findMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });

          if (mapRef.current) {
            mapRef.current.setZoom(13);
          }
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
          alert("Не удалось определить ваше местоположение.");
        }
      );
    } else {
      alert("Геолокация не поддерживается вашим браузером.");
    }
  };

  return (
    <div className="viewAgents">
      <button className="findBtn" onClick={findMe}>
        <img src={findIcon} alt="#" />
      </button>
      {isLoaded ? (
        <GoogleMap
          center={center}
          zoom={zoom}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={(map) => (mapRef.current = map)}
        >
          {markers?.map((pos, index) => (
            <CustomMarker
              key={index}
              position={{ lat: +pos?.lat, lng: +pos?.lon }}
              index={index}
              setCenter={setCenter}
              setZoom={setZoom}
              item={pos}
              mapRef={mapRef}
            />
          ))}
        </GoogleMap>
      ) : (
        <div>Загрузка карты...</div>
      )}
    </div>
  );
};

export default ViewAgents;
