import React from "react";

////// imgs
import lofOut from "../../../assets/images/logout.png";

////// style
import "./style.scss";
import { Tooltip } from "@mui/material";

const LogOut = () => {
  return (
    <Tooltip title={"Выйти"} placement="left">
      <div className="logOut">
        <button>
          <img src={lofOut} alt="()" />
        </button>
      </div>
    </Tooltip>
  );
};

export default LogOut;
