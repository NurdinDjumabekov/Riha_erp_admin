////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import MapHistory from "../MapHistory/MapHistory";

////// helpers

////// fns
import { getListTA } from "../../../store/reducers/mainSlice";
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import { clearSelects } from "../../../store/reducers/selectsSlice";
import { getListRoutes_TA } from "../../../store/reducers/mapSlice";

////// style
import "./style.scss";
import { setListPhotos } from "../../../store/reducers/photoSlice";

const HistoryRouteTA = () => {
  const dispatch = useDispatch();

  const { listTA } = useSelector((state) => state.mainSlice);

  const getData = async () => {
    try {
      dispatch(setListPhotos());
      await dispatch(getListTA({ first: true })).unwrap();
      const obj = { label: listTA?.[0]?.fio, value: listTA?.[0]?.guid };
      dispatch(setActiveTA(obj));
      await dispatch(getListRoutes_TA(listTA?.[0]?.guid)).unwrap(); // get историб маршрутов
    } catch (error) {}
  };

  useEffect(() => {
    getData();
    return () => dispatch(clearSelects());
  }, []);

  return (
    <>
      <div className="historyRouteTA">
        <MapHistory />
      </div>
    </>
  );
};

export default HistoryRouteTA;

// const handleFileChange = async (e) => {
//   const files = e?.target?.files;

//   if (files && files.length > 0) {
//     const formData = new FormData();
//     formData.append("agent_guid", dataSave?.guid);
//     formData.append("point_guid", guid_point);
//     formData.append("route_guid", route_guid);
//     formData.append("file", files[0]);
//     try {
//       await dispatch(sendPhotos({ data: formData })).unwrap();
//       console.log("File uploaded successfully");
//       e.target.value = null;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   }
// };
