////hooks
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// imgs

////// components
import Modals from "../../components/Modals/Modals";

/////// fns
import { setActiveActions_TA } from "../../store/reducers/mapSlice";

/////// helpers
import { listActions_TA } from "../../helpers/LocalData";
import { useNavigate } from "react-router-dom";

const ActionsRouteTA = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeActions_TA } = useSelector((state) => state.mapSlice);

  const closeModal = () => {
    dispatch(setActiveActions_TA({ guid_point: "", actionType: 0 }));
    /// очишаю для закрытия модалки
  };

  const link =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBoEakbCXS0yKg6yRKEsmsMyf9qbMLhwBEyokbVraQoK0ZarRTmE4GjmOI5tjkpCWaLY&usqp=CAU";

  const clickCateg = ({ link }) => {
    navigate(`${link}/${activeActions_TA?.guid_point}`);
  };

  return (
    <div className="actionsRouteTA">
      <Modals
        openModal={!!activeActions_TA?.guid_point}
        closeModal={closeModal}
        title={`Торговая точка : '${activeActions_TA?.point}'`}
      >
        <>
          <div className="titlesInfo">
            <div className="header">
              <div className="logo">
                <img src={activeActions_TA?.seller_photo || link} alt="" />
              </div>
              <div className="user">
                <span>{activeActions_TA?.seller_fio}</span>
                <span> +996{activeActions_TA?.seller_number}</span>
              </div>
            </div>
            <p>Время прихода: {activeActions_TA?.start_time}</p>
            <p>Время выхода: {activeActions_TA?.end_time}</p>
          </div>
          <div className="listActions">
            {listActions_TA?.map((item) => (
              <div
                style={{ background: item?.color }}
                onClick={() => clickCateg(item)}
              >
                {item?.icon}
                <p>{item?.name}</p>
              </div>
            ))}
          </div>
        </>
      </Modals>
    </div>
  );
};

export default ActionsRouteTA;
