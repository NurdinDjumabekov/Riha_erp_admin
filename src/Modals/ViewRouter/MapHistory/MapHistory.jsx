/////// hooks
import React, { useEffect, useState } from "react";
import { load } from "@2gis/mapgl";
import { useDispatch, useSelector } from "react-redux";

////// styles
import "./style.scss";

/////// helpers
import { styleRoutes } from "../../../helpers/objs";
import { transformLists } from "../../../helpers/transformLists";

/////// conmponents
import { Directions } from "@2gis/mapgl-directions";
import DatePicker from "react-datepicker";
import Select from "react-select";

////// fns
import {
  setActiveDate,
  setActiveTA,
} from "../../../store/reducers/selectsSlice";
import {
  reverseTransformActionDate,
  transformActionDate,
} from "../../../helpers/transformDate";
import { ru } from "date-fns/locale";

const MapHistory = () => {
  const dispatch = useDispatch();

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);

  const { mapGeo, key, activeViewMap } = useSelector((state) => state.mapSlice);
  const { activeTA, activeDate } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  const onChange = (item) => dispatch(setActiveTA(item));

  const onChangeDate = (item) =>
    dispatch(setActiveDate(transformActionDate(item)));

  useEffect(() => {
    load().then((mapgl) => {
      const initializedMap = new mapgl.Map("mapContainerHistory", {
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

  useEffect(() => {
    if (map && activeViewMap?.listRoute?.length > 0) {
      markers.forEach((m) => m.destroy());
      setMarkers([]);

      if (directions) {
        directions.clear();
      }

      const routePoints = activeViewMap?.listRoute?.map((point) => [
        point.lon,
        point.lat,
      ]);

      const newMarkers = activeViewMap.listRoute.map((point) => {
        const customMarker = document.createElement("div");
        customMarker.className = "customMarker";
        customMarker.innerHTML = `
          <div class='customMarker__inner'><i></i></div>
          <div class='customMarker__name'><p>${point.point}</p></div>
        `;

        const marker = new map.mapgl.HtmlMarker(map, {
          coordinates: [point.lon, point.lat],
          html: customMarker,
          anchor: [0.5, 1],
        });

        customMarker.addEventListener("click", () => {
          console.log(point, "point");
          alert(`Marker clicked: ${point.point}`);
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
  }, [map, activeViewMap, directions]);

  const list_TA = transformLists(listTA, "guid", "fio");

  return (
    <>
      <div className="mapHistory">
        <div className="mapHistory__header">
          <div className="select">
            <Select
              options={list_TA}
              className="select"
              onChange={onChange}
              value={activeTA}
              name="activeTA"
            />
          </div>
          <div className="date">
            <DatePicker
              selected={reverseTransformActionDate(activeDate)}
              onChange={onChangeDate}
              yearDropdownItemNumber={100}
              placeholderText="ДД.ММ.ГГГГ"
              shouldCloseOnSelect={true}
              scrollableYearDropdown
              dateFormat="dd.MM.yyyy"
              locale={ru}
            />
          </div>
        </div>
        <div id="mapContainerHistory" className="map-container"></div>
      </div>
    </>
  );
};

export default MapHistory;
