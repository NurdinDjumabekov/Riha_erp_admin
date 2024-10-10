/////// hooks
import React from "react";
import { useNavigate } from "react-router-dom";

////// imgs
import lofOut from "../../../assets/images/logout.png";
import LogoutIcon from "@mui/icons-material/Logout";

////// style
import "./style.scss";

/////// components
import { Tooltip } from "@mui/material";

const LogOut = ({ active }) => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
  };
  if (active) {
    return (
      <button onClick={logOut} className="logOut">
        <LogoutIcon />
        {active && <p>Выйти</p>}
      </button>
    );
  }

  return (
    <Tooltip title={"Выйти"} placement="left">
      <button onClick={logOut} className="logOut">
        <LogoutIcon />
        {active && <p>Выйти</p>}
      </button>
    </Tooltip>
  );
};

export default LogOut;
