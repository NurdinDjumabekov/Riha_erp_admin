////// hooks
import React, { useEffect, useState } from "react";
import { load } from "@2gis/mapgl";
import { useSelector } from "react-redux";
import { Directions } from "@2gis/mapgl-directions";

////// style
import "./style.scss";

const MapForChoicePoints = () => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [firstPoint, setFirstPoint] = useState(null);
  const [selecting, setSelecting] = useState("a");

  const { mapGeo, key } = useSelector((state) => state.mapSlice);

  useEffect(() => {
    load().then((mapgl) => {
      const initializedMap = new mapgl.Map("mapContainerChoice", {
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
  }, [key, mapGeo]);

  const handleMapClick = (e) => {
    const coords = e.lngLat;

    if (selecting !== "end") {
      const marker = new map.mapgl.Marker(map, {
        coordinates: coords,
        icon: "https://docs.2gis.com/img/dotMarker.svg",
      });
      setMarkers((prevMarkers) => [...prevMarkers, marker]);

      if (selecting === "a") {
        setFirstPoint(coords);
        setSelecting("b");
      } else if (selecting === "b") {
        setSelecting("end");

        if (firstPoint && directions) {
          directions.carRoute({
            points: [firstPoint, coords],
            style: {
              routeLineWidth: [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                20,
                10,
                5,
              ],
              substrateLineWidth: [
                "interpolate",
                ["linear"],
                ["zoom"],
                5,
                1,
                7,
                10,
              ],
              // Or just static width value
              haloLineWidth: 10,
            },
          });

          markers.forEach((m) => {
            m.destroy();
          });
          setMarkers([]);
        }
      }
    }
  };

  const clearRoute = () => {
    setSelecting("a");
    setFirstPoint(null);

    // Очищаем маршруты через объект directions
    if (directions) {
      directions.clear(); // Очищаем все маршруты
    }

    // Очищаем все маркеры
    markers.forEach((m) => {
      m.destroy();
    });
    setMarkers([]);
  };

  useEffect(() => {
    if (map) {
      map.on("click", handleMapClick);
    }
    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [map, firstPoint, markers, directions]);

  return (
    <div className="mapForChoicePoints">
      <button id="reset" onClick={clearRoute} className="clear">
        Очистить маршрут
      </button>
      <div
        id="mapContainerChoice"
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </div>
  );
};

export default MapForChoicePoints;
