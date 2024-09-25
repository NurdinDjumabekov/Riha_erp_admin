import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

///// map
import { load } from "@2gis/mapgl";

////// style
import "./style.scss";

import { getListTA } from "../../../store/reducers/mainSlice";
import { getAllRouteAgent } from "../../../store/reducers/mapSlice";
import { formatName } from "../../../helpers/searchActiveOrdersTA";

const ViewAgents = () => {
  const dispatch = useDispatch();

  const { invoiceInfo } = useSelector((state) => state.mainSlice);
  const { mapGeo, listRouteAllTA, key } = useSelector(
    (state) => state.mapSlice
  );

  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    let intervalId;
    if (invoiceInfo?.action === 6) {
      dispatch(getListTA({ first: true }));

      // Функция для обновления данных агентов
      const fetchRouteAgent = () => {
        dispatch(getAllRouteAgent());
      };

      fetchRouteAgent();
      intervalId = setInterval(fetchRouteAgent, 10000000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [invoiceInfo?.action, dispatch]);

  useEffect(() => {
    if (invoiceInfo?.action === 6) {
      let map;

      // Загружаем карту один раз и сохраняем в реф
      load().then((mapgl) => {
        map = new mapgl.Map("map-container-admin", {
          center: [
            mapGeo?.longitude || 74.5975735,
            mapGeo?.latitude || 42.8508686,
          ],
          zoom: 13,
          key,
        });
        mapRef.current = map;
      });

      return () => {
        if (mapRef.current) {
          mapRef.current.destroy();
        }
      };
    }
  }, [mapGeo, invoiceInfo?.action]);

  useEffect(() => {
    if (mapRef.current && listRouteAllTA) {
      markers.forEach((marker) => marker?.destroy());

      const updateMarkers = () => {
        load().then((mapgl) => {
          const newMarkers = listRouteAllTA.map((item) => {
            const { lat, lon, agent, status } = item;
            if (lat && lon) {
              const customMarker = document.createElement("div");
              customMarker.className = "marker";
              customMarker.innerHTML = `
                <div class="marker__inner ${
                  !!status ? "deActive" : ""
                }"><i></i></div>
                <div class="marker__name"><p>${formatName(agent)}</p></div>
              `;

              //   customMarker.addEventListener("click", () => {
              //     alert(`Agent: ${formatName(agent)}`);
              //   });

              return new mapgl.HtmlMarker(mapRef.current, {
                coordinates: [lon, lat],
                html: customMarker,
                anchor: [0.5, 1],
              });
            }
            return null;
          });

          setMarkers(newMarkers.filter(Boolean));
        });
      };

      requestAnimationFrame(updateMarkers);
    }
  }, [listRouteAllTA]);

  return (
    <div className="viewAgents">
      <div className="mapAgents">
        <MapMain />
      </div>
    </div>
  );
};

export default ViewAgents;

// Компонент для карты
const MapMain = React.memo(
  () => {
    return (
      <div
        id="map-container-admin"
        style={{ width: "100%", height: "100%" }}
      ></div>
    );
  },
  () => true
);
