import { ru } from "date-fns/locale";

/////// hooks
import React, { useEffect, useState } from "react";
import { load } from "@2gis/mapgl";
import { useDispatch, useSelector } from "react-redux";

////// styles
import "./style.scss";

/////// helpers
import { styleRoutes } from "../../../helpers/objs";
import { transformLists } from "../../../helpers/transformLists";
import { transformActionDate } from "../../../helpers/transformDate";
import { reverseTransformActionDate } from "../../../helpers/transformDate";

/////// conmponents
import { Directions } from "@2gis/mapgl-directions";
import DatePicker from "react-datepicker";
import Select from "react-select";
import MapMenuInfo from "../MapMenuInfo/MapMenuInfo";

////// fns
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import { setActiveDate } from "../../../store/reducers/selectsSlice";
import { setPointInfo } from "../../../store/reducers/mapSlice";
import { getListRoutes_TA } from "../../../store/reducers/mapSlice";

const MapHistory = ({}) => {
  const dispatch = useDispatch();

  //// activeViewMap check
  /// listHistoryRoute на потом

  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [markers, setMarkers] = useState([]);

  const { mapGeo, key, everyRoutes_TA } = useSelector(
    (state) => state.mapSlice
  );
  const { listHistoryRoute } = useSelector((state) => state.mapSlice); /// check
  const { activeTA, activeDate } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  const onChange = (item) => {
    dispatch(getListRoutes_TA(item?.value)); /// для получения более подробно инфы о точке
    dispatch(setActiveTA(item));
  };

  const onChangeDate = (item) => {
    dispatch(setActiveDate(transformActionDate(item)));
  };

  useEffect(() => {
    load().then((mapgl) => {
      const initializedMap = new mapgl.Map("mapContainerHistory", {
        center: [
          mapGeo?.longitude || 74.5975735,
          mapGeo?.latitude || 42.8508686,
        ],
        zoom: 13,
        key: key,
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

      const newMarkers = everyRoutes_TA?.map((point, index) => {
        const checkTA = !!point?.set_start_time; /// если время есть, то ТА посетил точку
        const checkTIndex = index == 0; /// если время есть, то ТА посетил точку

        const markerNameClass = `customMarker__name ${checkTA ? "active" : ""}
        ${checkTIndex ? "workShop" : ""}`;

        const markerIndex = checkTIndex ? "" : `${index}.`;

        const customMarker = document.createElement("div");
        customMarker.className = "customMarker";
        customMarker.innerHTML = `
        <div class="customMarker__point"><i></i></div>
        <div class="${markerNameClass}"><p><span class="customMarker__index">${markerIndex}</span>
        ${point?.point || "Цех"}</p></div>
      `;

        const marker = new map.mapgl.HtmlMarker(map, {
          coordinates: [parseFloat(point.lon), parseFloat(point.lat)],
          type: "html",
          html: customMarker,
          anchor: [0.5, 1],
        });

        customMarker.addEventListener("click", () => {
          if (index !== 0) {
            /// если это не цех
            clickPoint(point);
          }
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

  const clickPoint = (point) => dispatch(setPointInfo(point));

  const list_TA = transformLists(listTA, "guid", "fio");

  return (
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
            maxDate={new Date()}
          />
        </div>

        <div className="infoRoute">
          <div>
            <div className="greenRoute">Посетил точку</div>
            <div className="redRoute"> Не посетил</div>
          </div>
          <div>
            <div className="vialetRoute">
              Маршрут по которому должен был ехать ТА
            </div>
            <div className="bluetoute">Маршрут по которому ТА поехал</div>
          </div>
        </div>
      </div>
      <div id="mapContainerHistory" className="map-container"></div>
      <MapMenuInfo />
    </div>
  );
};

export default MapHistory;
