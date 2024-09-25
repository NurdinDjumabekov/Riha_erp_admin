///// hooks
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// icons
import CameraIcon from "@mui/icons-material/CameraAlt";
import SettingsIcon from "@mui/icons-material/ManageAccounts";
import Calendare from "@mui/icons-material/EventNote";
import MapIcon from "@mui/icons-material/AddLocationAlt";
import PayIcon from "@mui/icons-material/PlaylistAddCheckCircle";

const MenuAgents = () => {
  const location = useLocation();
  const [active, setActive] = useState("/");

  const listMenuAgents = [
    { id: 1, text: "Заявки", icons: <Calendare />, link: "/" },
    { id: 7, text: "Накладные", icons: <PayIcon />, link: "/my_invoice" },
    { id: 2, text: "Камера", icons: <CameraIcon />, link: "/camera" },
    { id: 3, text: "Карта", icons: <MapIcon />, link: "/maps" },
    { id: 5, text: "Отпуск ТТ", icons: <PayIcon />, link: "/send_app" },
    // { id: 4, text: "Настройки", icons: <SettingsIcon />, link: "/settings" },
  ];

  useEffect(() => {
    setActive(location?.pathname);
  }, [location?.pathname]);

  return (
    <div className="actionSettingsAgents">
      <div className="actionSettingsAgents__inner">
        {listMenuAgents?.map((item) => (
          <NavLink
            to={item?.link}
            className={active == item.link ? "activeIconMenu" : ""}
          >
            {item.icons}
            <p>{item?.text}</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MenuAgents;