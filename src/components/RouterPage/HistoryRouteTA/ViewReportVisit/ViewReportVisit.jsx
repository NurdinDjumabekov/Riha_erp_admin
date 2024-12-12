////// hooks
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

////// fns

////// style
import "./style.scss";

////// helpers
import { roundingNum } from "../../../../helpers/totals";

///// icons
import PhoneIcon from "@mui/icons-material/Phone";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TimeIcon from "@mui/icons-material/AccessTime";

////// components
import Slider from "react-slick";
import ActionsPoints from "../ActionsPoints/ActionsPoints";
import { getListProdsPointReq } from "../../../../store/reducers/reportsSlice";

const ViewReportVisit = (props) => {
  const { initialSlide, setInitialSlide, refSlider, mapRef } = props;
  const dispatch = useDispatch();

  const [active, setActive] = useState({});
  const [table, setTable] = useState({ rel: [], ret: [], guid: "" });

  const { everyRoutes_TA } = useSelector((state) => state.mapSlice);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    nextArrow: <NoneBtn />,
    prevArrow: <NoneBtn />,
    initialSlide,
    responsive: [
      { breakpoint: 2240, settings: { slidesToShow: 3 } },
      { breakpoint: 1750, settings: { slidesToShow: 2 } },
    ],
  };

  const clickTitle = useCallback(({ lat, lng }) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng }); // Перемещаем карту в заданное положение
      mapRef.current.setZoom(16);
    }
  }, []);

  const viewProdPoints = async (item) => {
    //// просмотр товаров возврата и реалихации каждой точки
    const { point_guid, date, point } = item;
    const send = { point_guid, date };
    const data = await dispatch(getListProdsPointReq(send)).unwrap();
    const past = { guid: point_guid, point };
    setTable({ rel: data?.listRel, ret: data?.listRet, ...past });
  };

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
                <p>Посмотреть фото и видео</p>
              </div>
              <div className="time viewFiles" onClick={() => viewProdPoints(i)}>
                <p>Посмотреть список товаров</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <ActionsPoints
        active={active}
        setActive={setActive}
        setTable={setTable}
        table={table}
      />
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
