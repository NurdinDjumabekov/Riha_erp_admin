import React, { useEffect, useRef } from "react";
import { load } from "@2gis/mapgl";
import { useSelector } from "react-redux";

/////// style
import "./style.scss";

////// imgs
import iconNav from "../../assets/icons/arrowMapNav.svg";

const MapsPage = () => {
  const statusRef = useRef(null); // Для статуса
  const { mapGeo } = useSelector((state) => state.mapSlice);
  const buttonRef = useRef(null); // Для кнопки "Найти меня"

  useEffect(() => {
    let map;

    load().then((mapgl) => {
      map = new mapgl.Map("map-container", {
        center: [
          mapGeo?.longitude || 74.5975735,
          mapGeo?.latitude || 42.8508686,
        ],
        zoom: 13,
        key: "4b360754-94b6-4399-9a7b-35811336eb5f",
      });

      // Добавляем маркер на начальные координаты
      new mapgl.Marker(map, {
        coordinates: [mapGeo?.longitude, mapGeo?.latitude],
      });

      let circle; // Круглый маркер для местоположения пользователя

      // Успешное получение геолокации
      function success(pos) {
        const center = [74.5975735, 42.8508686];

        if (statusRef.current) {
          statusRef.current.textContent = "Location found!";
        }

        if (circle) {
          circle.destroy();
        }

        // Добавляем круглый маркер на карту
        circle = new mapgl.CircleMarker(map, {
          coordinates: center,
          radius: 14,
          color: "#0088ff",
          strokeWidth: 4,
          strokeColor: "#ffffff",
          stroke2Width: 6,
          stroke2Color: "#0088ff55",
        });

        // Центрируем карту на новом местоположении
        map.setCenter(center);
        map.setZoom(16);
      }

      // Обработка ошибок геолокации
      function error() {
        if (statusRef.current) {
          statusRef.current.textContent = "Unable to retrieve your location";
        }
      }

      // Функция для поиска текущего местоположения
      function geoFindMe() {
        if (!navigator.geolocation) {
          if (statusRef.current) {
            statusRef.current.textContent =
              "Geolocation is not supported by your browser";
          }
        } else {
          if (statusRef.current) {
            statusRef.current.textContent = "Locating…";
          }
          navigator.geolocation.getCurrentPosition(success, error);
        }
      }

      // Привязываем функцию к кнопке "Найти меня"
      if (buttonRef.current) {
        buttonRef.current.addEventListener("click", geoFindMe);
      }

      geoFindMe();

      // const segments = [
      //   {
      //     color: "#e84646",
      //     label: "A",
      //     coords: [
      //       [74.5907, 42.8765], // Пункт А (начало маршрута)
      //       [74.5922, 42.8751], // Дорога 1
      //       [74.5944, 42.874], // Дорога 2
      //     ],
      //   },
      //   {
      //     color: "#e3e340",
      //     coords: [
      //       [74.5944, 42.874], // Переход на другой сегмент
      //       [74.5966, 42.8725], // Дорога 3
      //       [74.5988, 42.871], // Дорога 4
      //     ],
      //   },
      //   {
      //     color: "#43e843",
      //     label: "B",
      //     coords: [
      //       [74.5988, 42.871], // Пункт B (конец маршрута)
      //       [74.6009, 42.8695], // Дорога 5
      //     ],
      //   },
      // ];

      // segments.forEach((segment, i) => {
      //   const zIndex = segments.length - 1 - i;

      //   // Добавляем полилинии для маршрута
      //   new mapgl.Polyline(map, {
      //     coordinates: segment.coords,
      //     width: 10,
      //     color: segment.color,
      //     width2: 14,
      //     color2: "#ffffff",
      //     zIndex,
      //   });

      //   if (segment.label) {
      //     const isFirstPoint = i === 0;
      //     const lastPointIndex = segment.coords.length - 1;
      //     const coords = isFirstPoint
      //       ? segment.coords[0]
      //       : segment.coords[lastPointIndex];

      //     // Добавляем круглый маркер
      //     new mapgl.CircleMarker(map, {
      //       coordinates: coords,
      //       radius: 16,
      //       color: "#0088ff",
      //       strokeWidth: 2,
      //       strokeColor: "#ffffff",
      //       zIndex: isFirstPoint ? 5 : 3,
      //     });

      //     // Добавляем текстовую метку (label)
      //     new mapgl.Label(map, {
      //       coordinates: coords,
      //       text: segment.label,
      //       fontSize: 14,
      //       color: "#ffffff",
      //       zIndex: isFirstPoint ? 6 : 4,
      //     });
      //   }
      // });
    });

    // Уничтожаем карту при размонтировании
    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, []);

  return (
    <div className="map2Gis">
      <button ref={buttonRef} className="btnNavMap">
        <img src={iconNav} alt=">" />
      </button>
      <MapWrapper />
    </div>
  );
};

export default MapsPage;

// Компонент для карты
const MapWrapper = React.memo(
  () => {
    return (
      <div id="map-container" style={{ width: "100%", height: "100%" }}></div>
    );
  },
  () => true
);
