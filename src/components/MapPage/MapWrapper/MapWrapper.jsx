import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { load } from "@2gis/mapgl";
import { Directions } from "@2gis/mapgl-directions";
import { styleRoutes } from "../../../helpers/objs";
import "./style.scss";
import { setActiveActions_TA } from "../../../store/reducers/mapSlice";

const MapWrapper = ({ searchMe }) => {
  const dispatch = useDispatch();
  const { mapGeo, everyRoutes_TA } = useSelector((state) => state.mapSlice);
  const { key } = useSelector((state) => state.mapSlice);

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    load().then((mapgl) => {
      const initializedMap = new mapgl.Map("mapContainerTA", {
        center: [
          mapGeo?.longitude || 74.5975735,
          mapGeo?.latitude || 42.8508686,
        ],
        zoom: 13,
        key,
      });

      setMap(initializedMap);

      const directionsInstance = new Directions(initializedMap, {
        directionsApiKey: key,
      });
      setDirections(directionsInstance);

      initializedMap.mapgl = mapgl;
    });

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, [key]);

  useEffect(() => {
    if (map && everyRoutes_TA?.length > 0) {
      markers.forEach((m) => m.destroy());
      setMarkers([]);

      if (directions) {
        directions.clear();
      }

      const routePoints = everyRoutes_TA?.map((point) => [
        parseFloat(point.lon),
        parseFloat(point.lat),
      ]);

      const newMarkers = everyRoutes_TA.map((point, index) => {
        const customMarker = document.createElement("div");
        customMarker.className = "customMarker";
        customMarker.innerHTML = `${
          !!point?.myGeo
            ? "<div class='customMarker__inner'><i></i></div>"
            : `<div class='customMarker__point'><i></i></div>
            <div class='customMarker__name'><p><span class='customMarker__index'>${
              index + 1
            }</span>. ${point.point}</p></div>`
        }
        `;

        const marker = new map.mapgl.HtmlMarker(map, {
          coordinates: [parseFloat(point.lon), parseFloat(point.lat)],
          html: customMarker,
          anchor: [0.5, 1],
        });

        customMarker.addEventListener("click", () => {
          const obj = {
            ...point,
            guid_point: point?.guid,
            actionType: 1,
            point: point?.point,
          };
          dispatch(setActiveActions_TA(obj));
          //  модалка для  действий (сфотать, отпустить накладную и т.д.)
        });

        return marker;
      });

      setMarkers(newMarkers);

      if (routePoints.length >= 2 && directions) {
        directions.carRoute({
          points: routePoints,
          style: styleRoutes,
        });
      }
    }
  }, [map, everyRoutes_TA, directions, mapGeo]);

  const searchMeFN = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];

          // Центрируем карту на геолокации пользователя
          map.setCenter(userLocation);
          map.setZoom(15); // Можно изменить масштаб карты

          // Добавим маркер на место пользователя
          // const userMarker = new map.mapgl.Marker(map, {
          //   coordinates: userLocation,
          //   color: "#ff0000", // Красный маркер для пользователя
          // });

          // // Удалить маркер через какое-то время, если нужно
          // setTimeout(() => userMarker.remove(), 5000);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    searchMeFN();
  }, [searchMe]);

  return (
    <div className="mapBlock">
      <MapMain />
    </div>
  );
};

export default MapWrapper;

// Компонент для карты
const MapMain = React.memo(
  () => {
    return (
      <div id="mapContainerTA" style={{ width: "100%", height: "100%" }}></div>
    );
  },
  () => true
);
