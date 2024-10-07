/////// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// styles
import "./style.scss";

////// helpers
import { logoSeller } from "../../../helpers/LocalData";

///// icons
import PhoneIcon from "@mui/icons-material/Phone";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimeIcon from "@mui/icons-material/AccessTime";
import CarCrashIcon from "@mui/icons-material/CarCrash";

///// fns

////// components
import EverySlide from "../EverySlide/EverySlide";

const MapMenuInfo = ({ totalDistance }) => {
  const dispatch = useDispatch();

  const { everyRoutes_TA } = useSelector((state) => state.mapSlice);
  const { activeRouteList } = useSelector((state) => state.photoSlice);

  const list = everyRoutes_TA?.slice(1);

  console.log(list, "list");

  // const litr = 72;
  // const rashod = 72;

  // const priceCar = totalDistance?.toFixed(2);

  return (
    <div className="mapMenuInfo__parent scroll_table">
      {/* <p className="time car">
        <CarCrashIcon />
        Расход на топливо: 12 л. ({totalDistance?.toFixed(2) * 82} сом)
      </p> */}
      {list?.map((i) => (
        <div className="mapMenuInfo">
          <div className="mapMenuInfo__title">
            <h5>
              <StorefrontIcon />
              {i?.point}
            </h5>
            <div className="userSeller">
              <div className="logo">
                <img src={i?.seller_photo || logoSeller} alt="" />
              </div>
              <div className="seller">
                <p>{i?.seller_fio}</p>
                <div className="seller__inner">
                  <PhoneIcon />
                  <p>+996{i?.seller_number}</p>
                </div>
              </div>
            </div>
            <p className="time">
              <TimeIcon />
              Время прихода торгового агента:{" "}
              {i?.set_start_time || "отсутствует"}
            </p>
            <div className="camon">
              <input type="checkbox" checked={!!i?.set_start_time} />
              <p>Посетил точку </p>
            </div>
          </div>
          <EverySlide i={i} />
          {/* {!!link && (
            <a href={link} className="invoice" target="_blank">
              <ListIcon />
              <span>Посмотреть накладную</span>
            </a>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default MapMenuInfo;
