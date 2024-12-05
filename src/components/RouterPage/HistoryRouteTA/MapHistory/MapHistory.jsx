import { ru } from "date-fns/locale";

/////// hooks
import React, { useEffect, useState } from "react";
import { load } from "@2gis/mapgl";
import { useDispatch, useSelector } from "react-redux";

////// styles
import "./style.scss";

/////// helpers
import { styleRoutes, styleRoutesNoPlan } from "../../../../helpers/objs";
import { transformLists } from "../../../../helpers/transformLists";
import { reverseTransformActionDate } from "../../../../helpers/transformDate";
import { transformActionDate } from "../../../../helpers/transformDate";

/////// components
import { Directions } from "@2gis/mapgl-directions";
import DatePicker from "react-datepicker";
import Select from "react-select";

////// fns
import { setActiveTA } from "../../../../store/reducers/selectsSlice";
import { getListRoutes_TA } from "../../../../store/reducers/mapSlice";
import MapRoutes from "../MapRoutes/MapRoutes";
import MapRoutesNoPlan from "../MapRoutesNoPlan/MapRoutesNoPlan";

const MapHistory = ({}) => {
  const dispatch = useDispatch();

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { listTA_RouteNoPlan } = useSelector((state) => state.mapSlice);

  const { activeTA, activeDate } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  const onChange = (item) => {
    const obj = { agent_guid: item?.value, user_type, activeDate };
    dispatch(setActiveTA(item)); /// активный state для селекта ТА
    dispatch(getListRoutes_TA(obj)); /// get данных координат точек определенного агента
    // dispatch(getActiveRouteList(item?.value));
    //// отправляю запрос для получения точек каждого агента
  };

  // const onChangeDate = (item) => {
  //   dispatch(setActiveDate(transformActionDate(item))); /// активный state для селекта даты
  //   const obj = {
  //     agent_guid: activeTA?.value,
  //     user_type,
  //     activeDate: transformActionDate(item),
  //   };
  //   dispatch(getListRoutes_TA(obj)); /// get данных координат точек определенного агента
  // };

  // console.log(listTA_RouteNoPlan, "listTA_RouteNoPlan");

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

        {/* <div className="date">
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
        </div> */}

        <div className="infoRoute">
          <div>
            <div className="greenRoute">Посетил точку</div>
            <div className="redRoute">Не посетил</div>
          </div>
          <div>
            <div className="vialetRoute">
              Маршрут, по которому должен был ехать ТА
            </div>
            <div className="bluetoute">Маршрут, по которому ТА поехал</div>
          </div>
        </div>

        {/* <div className="distanceInfo">
          <p>Общее расстояние маршрута: {totalDistance.toFixed(2)} км</p>
        </div> */}
      </div>

      {/* <MapRoutes /> */}
      <MapRoutesNoPlan />
      {/* <MapMenuInfo totalDistance={totalDistance} /> */}
    </div>
  );
};

export default MapHistory;
