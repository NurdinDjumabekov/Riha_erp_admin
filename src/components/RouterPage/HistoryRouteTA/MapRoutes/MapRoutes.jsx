import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useSelector } from "react-redux";

////// imgs
import findIcon from "../../../../assets/icons/findMe.svg";

////// components
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import CustomMarker from "../CustomMarker/CustomMarker";

////// env
const { REACT_APP_MAP_KEY } = process.env;

const MapRoutes = () => {
  const [center, setCenter] = useState({ lat: 42.8540827, lng: 74.6283202 }); // начальная позиция
  const [zoom, setZoom] = useState(12);
  const [directionsSegments, setDirectionsSegments] = useState([]); // Сегменты маршрутов
  const { everyRoutes_TA } = useSelector((state) => state.mapSlice);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAP_KEY,
    libraries: useMemo(() => ["places"], []),
  });

  // Функция для разделения маршрута и рендера сегментов
  const renderRoutes = useCallback(() => {
    if (!isLoaded || everyRoutes_TA?.length < 2) return;

    const segments = [];
    const maxWaypoints = 20; // Максимум промежуточных точек

    // Разделение маршрута на сегменты
    for (let i = 0; i < everyRoutes_TA?.length - 1; i += maxWaypoints) {
      const origin = everyRoutes_TA?.[i];
      const destination =
        everyRoutes_TA?.[
          Math.min(i + maxWaypoints, everyRoutes_TA?.length - 1)
        ];
      const waypoints = everyRoutes_TA
        .slice(i + 1, Math.min(i + maxWaypoints, everyRoutes_TA?.length - 1))
        .map((location) => ({
          location,
          stopover: true,
        }));

      segments.push({ origin, destination, waypoints });
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Построение маршрутов для каждого сегмента
    Promise.all(
      segments.map(
        ({ origin, destination, waypoints }) =>
          new Promise((resolve, reject) => {
            directionsService.route(
              {
                origin,
                destination,
                waypoints,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  resolve(result);
                } else {
                  console.error("Ошибка построения маршрута:", status);
                  reject(status);
                }
              }
            );
          })
      )
    )
      .then((results) => {
        setDirectionsSegments(results); // Сохраняем все сегменты маршрута
      })
      .catch((error) => console.error("Ошибка построения сегментов:", error));
  }, [isLoaded, everyRoutes_TA]);

  useEffect(() => {
    if (isLoaded) {
      renderRoutes();
    }
  }, [isLoaded, renderRoutes]);

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
    <div className="mapHistory">
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
          {everyRoutes_TA?.map((pos, index) => {
            if (!!pos?.point) {
              return <CustomMarker key={index} position={pos} index={index} />;
            }
          })}

          {directionsSegments.map((directions, index) => (
            <DirectionsRenderer
              key={index}
              directions={directions}
              options={{ suppressMarkers: true }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div>Загрузка карты...</div>
      )}
    </div>
  );
};

export default MapRoutes;
