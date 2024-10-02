/////// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// styles
import "./style.scss";

////// helpers
import { logoSeller } from "../../../helpers/LocalData";

///// icons
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import ListIcon from "@mui/icons-material/Checklist";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimeIcon from "@mui/icons-material/AccessTime";
import CarCrashIcon from "@mui/icons-material/CarCrash";

///// fns
import { getListPhotos } from "../../../store/reducers/photoSlice";

////// components
import Slider from "react-slick";
import { checkIsFile } from "../../../helpers/validations";
import { useRef } from "react";

const MapMenuInfo = () => {
  const dispatch = useDispatch();
  let sliderRef = useRef(null);

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listPhotos } = useSelector((state) => state.photoSlice);
  const { pointInfo } = useSelector((state) => state.mapSlice);

  useEffect(() => {
    if (pointInfo?.guid) {
      const obj = {
        guid: activeTA?.value,
        guid_point: pointInfo?.point_guid,
        route_guid: pointInfo?.guid,
      };
      dispatch(getListPhotos(obj));
    }
  }, [pointInfo]);

  //////////////////// Slider
  const settings = {
    dots: false,
    infinite: listPhotos.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: listPhotos.length > 1,
  };

  const link =
    "https://riha-production.333.kg/files/invoice/Otpusk-nakladnaya-18-2024-10-02(06:29:09).pdf";

  return (
    <div className="mapMenuInfo">
      <div className="mapMenuInfo__title">
        <h5>
          <StorefrontIcon />
          {pointInfo?.point}
        </h5>
        <div className="userSeller">
          <div className="logo">
            <img src={pointInfo?.seller_photo || logoSeller} alt="" />
          </div>
          <div className="seller">
            <p>{pointInfo?.seller_fio}</p>
            <div className="seller__inner">
              <PhoneIcon />
              <p>+996{pointInfo?.seller_number}</p>
            </div>
          </div>
        </div>
        <p className="time">
          <TimeIcon />
          Время прихода торгового агента:{" "}
          {pointInfo?.set_start_time || "отсутствует"}
        </p>
        <p className="time">
          <CarCrashIcon />
          Расход на топливо: 12 л. ({12 * 82} сом)
        </p>
      </div>
      {listPhotos?.length > 0 && (
        <div className="mapMenuInfo__slider">
          <Slider
            ref={(slider) => {
              sliderRef = slider;
            }}
            {...settings}
          >
            {listPhotos?.map((i, index) => (
              <div className="everySlide" key={index}>
                {checkIsFile(i?.file_path) === "image" ? (
                  <img src={i?.file_path} alt="###" />
                ) : (
                  <div className="videoBlock">
                    <video controls>
                      <source src={i?.file_path} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
            ))}
          </Slider>
          <button className="prev" onClick={() => sliderRef.slickPrev()}>
            <ArrowIcon />
          </button>
          <button className="next" onClick={() => sliderRef.slickNext()}>
            <ArrowIcon />
          </button>
        </div>
      )}
      {!!link && (
        <a href={link} className="invoice" target="_blank">
          <ListIcon />
          <span>Посмотреть накладную</span>
        </a>
      )}
    </div>
  );
};

export default MapMenuInfo;
