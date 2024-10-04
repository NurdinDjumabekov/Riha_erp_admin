import React, { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import { useSelector } from "react-redux";

const AddPointsPage = () => {
  const mapRef = useRef(null); // Ref для хранения экземпляра карты
  const [selectedIds, setSelectedIds] = useState([]);
  const { mapGeo, key } = useSelector((state) => state.mapSlice);

  useEffect(() => {
    // Загружаем карту только один раз
    if (!mapRef.current) {
      load().then((mapgl) => {
        mapRef.current = new mapgl.Map("mapContainer", {
          center: [mapGeo?.longitude || 55.308, mapGeo?.latitude || 25.237],
          zoom: 18,
          key,
        });

        // Установка обработчика клика на карту
        mapRef.current.on("click", handleMapClick);
      });
    }

    // Очистка карты при размонтировании компонента
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [mapGeo, key]); // Перезагрузка карты только при изменении ключа или центра

  // Обработчик клика по карте
  const handleMapClick = (e) => {
    if (!e.target) return;

    const { id } = e.target;
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((i) => i !== id)
        : [id];

      mapRef.current?.setSelectedObjects(newSelectedIds);
      return newSelectedIds;
    });
  };

  return <div id="mapContainer" style={{ width: "100%", height: "100vh" }} />;
};

export default AddPointsPage;
