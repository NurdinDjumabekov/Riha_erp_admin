////// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// fns

////// style
import "./style.scss";

////// helpers

///// icons
import PhoneIcon from "@mui/icons-material/Phone";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimeIcon from "@mui/icons-material/AccessTime";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import UserIcon from "@mui/icons-material/AccountCircle";
import { logoSeller } from "../../../../helpers/LocalData";

////// components
import Slider from "react-slick";
import { roundingNum } from "../../../../helpers/totals";
import EverySlide from "../EverySlide/EverySlide";
import { useCallback } from "react";

const ViewReportVisit = (props) => {
  const { initialSlide, setInitialSlide, refSlider, mapRef } = props;
  const dispatch = useDispatch();

  const [active, setActive] = useState({});

  const { everyRoutes_TA } = useSelector((state) => state.mapSlice);

  var settings = {
    // className: "centerSlide",
    dots: false,
    infinite: false,
    // centerPadding: "60px",
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    nextArrow: <NoneBtn />,
    prevArrow: <NoneBtn />,
    initialSlide,
    // centerMode: true,
    // variableWidth: true,
    responsive: [
      { breakpoint: 2240, settings: { slidesToShow: 3 } },
      { breakpoint: 1750, settings: { slidesToShow: 2 } },
    ],
  };

  const clickTitle = useCallback(({ lat, lng }) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng }); // Перемещаем карту в заданное положение
      mapRef.current.setZoom(13);
    }
  }, []);

  return (
    <div className="viewReportVisit">
      <Slider ref={refSlider} {...settings}>
        {everyRoutes_TA?.map((i, index) => (
          <div className="mapMenuInfo">
            <div className="mapMenuInfo__title">
              <h5
                className={!!i?.set_start_time ? "active" : ""}
                onClick={() => clickTitle(i)}
              >
                <StorefrontIcon />
                {index + 1}. {i?.point}
              </h5>
              <div className="userSeller">
                <div className="seller">
                  <p>Продавец: {i?.seller_fio}</p>
                  <div className="seller__inner">
                    <PhoneIcon />
                    <p>+996{i?.seller_number || " ..."}</p>
                  </div>
                </div>
              </div>
              <div className="time">
                <p>Статус посещения: {i?.result || "отсутствует"}</p>
              </div>
              <div className="time">
                <TimeIcon />
                <p>
                  Время прихода торгового агента:{" "}
                  {i?.set_start_time || "отсутствует"}
                </p>
              </div>
              <div className="time">
                <TimeIcon />
                <p>
                  Время ухода торгового агента:{" "}
                  {i?.set_end_time || "отсутствует"}
                </p>
              </div>
              <div className="time">
                <p>Баланс агента: {roundingNum(i?.balance) || "0"} сом</p>
              </div>
              <div className="time">
                <p>Комментарий агента: {i?.comment || "..."}</p>
              </div>
              <div className="time viewFiles" onClick={() => setActive(i)}>
                <p>Посмотреть файлы</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <EverySlide active={active} setActive={setActive} />
    </div>
  );
};

export default ViewReportVisit;

export const NoneBtn = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none", background: "green" }}
      onClick={onClick}
    />
  );
};
