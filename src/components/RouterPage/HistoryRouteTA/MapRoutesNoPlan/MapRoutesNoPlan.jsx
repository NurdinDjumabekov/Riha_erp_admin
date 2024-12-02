import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";

////// imgs
import findIcon from "../../../../assets/icons/findMe.svg";

////// components
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import CustomMarker from "../CustomMarker/CustomMarker";
import { getListRoutes_TA } from "../../../../store/reducers/mapSlice";
import CustomMarkerRoute from "../CustomMarkerRoute/CustomMarkerRoute";

////// env
const { REACT_APP_MAP_KEY } = process.env;

const MapRoutesNoPlan = () => {
  const dispatch = useDispatch();

  const [center, setCenter] = useState({ lat: 42.8540827, lng: 74.6283202 }); // начальная позиция
  const [zoom, setZoom] = useState(12);
  const [directionsSegments, setDirectionsSegments] = useState([]); // Сегменты маршрутов
  const { everyRoutes_TA, listTA_RouteNoPlan } = useSelector(
    (state) => state.mapSlice
  );
  const { activeTA, activeDate } = useSelector((state) => state.selectsSlice);
  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const filteredListTA_RouteNoPlan = filterMarkers(listTA_RouteNoPlan);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAP_KEY,
    libraries: useMemo(() => ["places"], []),
  });

  useEffect(() => {
    // Функция для получения данных маршрутов
    const fetchRoutes = () => {
      const obj = { agent_guid: activeTA?.value, user_type, activeDate };
      dispatch(getListRoutes_TA(obj));
    };

    // Настроим интервал для вызова каждые 60 секунд
    const intervalId = setInterval(fetchRoutes, 600000);

    // Очистка интервала при размонтировании компонента или изменении isLoaded
    return () => clearInterval(intervalId);
  }, [isLoaded]);

  // Функция для разделения маршрута и рендера сегментов
  const renderRoutes = useCallback(() => {
    if (!isLoaded || filteredListTA_RouteNoPlan?.length < 2) return;

    const segments = [];
    const maxWaypoints = 20; // Максимум промежуточных точек

    // Разделение маршрута на сегменты
    for (
      let i = 0;
      i < filteredListTA_RouteNoPlan?.length - 1;
      i += maxWaypoints
    ) {
      const origin = filteredListTA_RouteNoPlan?.[i];
      const destination =
        filteredListTA_RouteNoPlan?.[
          Math.min(i + maxWaypoints, filteredListTA_RouteNoPlan?.length - 1)
        ];
      const waypoints = filteredListTA_RouteNoPlan
        .slice(
          i + 1,
          Math.min(i + maxWaypoints, filteredListTA_RouteNoPlan?.length - 1)
        )
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

  useEffect(() => {
    if (isLoaded) {
      renderRoutes();
    }
  }, [isLoaded, renderRoutes]);

  console.log(activeTA, "activeTA");

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

          {/* {filteredListTA_RouteNoPlan?.map((pos, index) => {
            return <CustomMarkerRoute key={index} position={pos} />;
          })} */}

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

export default MapRoutesNoPlan;

// Функция для вычисления расстояния между двумя точками на Земле
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180; // Широта в радианах
  const φ2 = (lat2 * Math.PI) / 180; // Широта в радианах
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Разница в широте
  const Δλ = ((lng2 - lng1) * Math.PI) / 180; // Разница в долготе

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Расстояние в метрах

  return distance;
};

const filterMarkers = (markers) => {
  const filteredMarkers = [];

  markers.forEach((marker, index) => {
    const isNearby = filteredMarkers.some((existingMarker) => {
      const distance = calculateDistance(
        marker.lat,
        marker.lng,
        existingMarker.lat,
        existingMarker.lng
      );
      return distance < 30; // Проверяем, если расстояние менее 500 метров
    });

    if (!isNearby) {
      filteredMarkers.push(marker); // Добавляем маркер, если рядом нет других
    }
  });

  return filteredMarkers;
};
