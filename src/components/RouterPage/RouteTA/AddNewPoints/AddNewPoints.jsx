import React, { useRef, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

///// style
import "./style.scss";

///// fns
import {
  setActiveViewMap,
  addNewPointsReq,
} from "../../../../store/reducers/mapSlice";

///// helpers
import { myAlert } from "../../../../helpers/MyAlert";
import SendInput from "../../../../common/SendInput/SendInput";
import { clearActiveMap } from "../../../../helpers/clear";

////// imgs
import SaveIcon from "@mui/icons-material/Save";

////// components
import Modals from "../../../../common/Modals/Modals";

////// env
const { REACT_APP_MAP_KEY } = process.env;

const AddNewPoints = () => {
  const dispatch = useDispatch();

  const [addPoint, setAddPoint] = useState({});
  const [listPoints, setListPoints] = useState([]);
  const { activeTA } = useSelector((state) => state.selectsSlice);

  const mapRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: REACT_APP_MAP_KEY,
    libraries: useMemo(() => ["places"], []),
  });

  const handleMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: coords }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        setAddPoint({
          name: address,
          address,
          lat: coords?.lat,
          lon: coords?.lng,
        });
      } else {
        console.error("Geocoder не смог получить адрес:", status);
      }
    });
  };

  const saveData = () => {
    //// сохранить новую точку
    const data = {
      ...addPoint,
      type_guid: "85DB5D34-2FB5-45EA-849F-97BF11BC2E4C",
      user_guid: activeTA?.value,
      user_type: 1,
    };
    dispatch(addNewPointsReq({ data, clearRoute }));
  };

  const onChange = (e) => {
    setAddPoint({ ...addPoint, [e.target?.name]: e.target?.value });
  };

  const clearRoute = () => {
    dispatch(setActiveViewMap(clearActiveMap));
    setAddPoint({});
  };

  if (loadError) return <p>Ошибка загрузки карты</p>;
  if (!isLoaded) return <p>Загрузка карты...</p>;

  return (
    <>
      <div className="mapForChoiceTT">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={{ lat: 42.8508686, lng: 74.5975735 }}
          zoom={13}
          onClick={handleMapClick}
          ref={mapRef}
        >
          {listPoints?.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
        <div className="mapForChoiceTT__actions">
          <button onClick={clearRoute} className="clearMapBtn">
            <p>Закрыть</p>
          </button>
        </div>
      </div>

      <div className="addNewPoints">
        <Modals
          openModal={!!addPoint?.name}
          closeModal={() => setAddPoint({})}
          title={"Добавить новую точку"}
        >
          <div className="addNewPoints__inner">
            <SendInput
              value={addPoint?.name}
              onChange={onChange}
              title={"Наименование точки"}
              name={"name"}
            />
            <SendInput
              value={addPoint?.address}
              onChange={onChange}
              title={"Адрес точки"}
              name={"address"}
            />
            <SendInput
              value={addPoint?.phone}
              onChange={onChange}
              title={"Адрес точки"}
              name={"phone"}
              type={"number"}
              placeholder={"0700754454"}
            />
            <SendInput
              value={addPoint?.inn}
              onChange={onChange}
              title={"ИНН"}
              name={"inn"}
              type={"number"}
              placeholder={"*************"}
            />
            <SendInput
              value={addPoint?.ittn}
              onChange={onChange}
              title={"ИНТ"}
              name={"ittn"}
              placeholder={"*************"}
            />
            <SendInput
              value={addPoint?.name_owner}
              onChange={onChange}
              title={"ФИО владельца точки"}
              name={"name_owner"}
            />
            <SendInput
              value={addPoint?.number_owner}
              onChange={onChange}
              title={"Номер владельца точки"}
              name={"number_owner"}
              type={"number"}
              placeholder={"0700754454"}
            />
            <button onClick={saveData} className="saveCoords">
              <SaveIcon />
              <p>Сохранить</p>
            </button>
          </div>
        </Modals>
      </div>
    </>
  );
};

export default AddNewPoints;
