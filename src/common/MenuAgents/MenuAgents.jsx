///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// icons
import CameraIcon from "@mui/icons-material/CameraAlt";
import SettingsIcon from "@mui/icons-material/ManageAccounts";
import Calendare from "@mui/icons-material/EventNote";
import MapIcon from "@mui/icons-material/AddLocationAlt";
import PayIcon from "@mui/icons-material/Paid";

const MenuAgents = () => {
  return (
    <div className="actionSettingsAgents">
      <div className="actionSettingsAgents__inner">
        <button>
          <CameraIcon />
          <p>Камера</p>
        </button>
        <button>
          <Calendare />
          <p>Календарь</p>
        </button>
        <button>
          <MapIcon />
          <p>Карта</p>
        </button>
        <button>
          <PayIcon />
          <p>Оплаты</p>
        </button>
        <button>
          <SettingsIcon />
          <p>Настройки</p>
        </button>
      </div>
    </div>
  );
};

export default MenuAgents;
