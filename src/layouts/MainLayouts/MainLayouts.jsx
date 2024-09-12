///// hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

import MenuLeft from "../../components/Menu/MenuLeft/MenuLeft";
import { getListTA, getListWorkShop } from "../../store/reducers/requestSlice";
import LogOut from "../../components/ActionSettings/LogOut/LogOut";

import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { Tooltip } from "@mui/material";

const MainLayouts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);

  useEffect(() => {
    dispatch(getListWorkShop());
    dispatch(getListTA({ first: true }));
  }, []);

  const objType = { 2: <MenuLeft /> };

  return (
    <div className="layouts">
      {objType?.[user_type]}
      <div className="pages">
        <Outlet />
      </div>
      <div className="actionSettings">
        <div className="actionSettings__inner">
          <Tooltip title={"Настройки"} placement="left">
            <button>
              <SettingsSuggestOutlinedIcon sx={{ color: "#fff" }} />
            </button>
          </Tooltip>
          <Tooltip title={"Отчеты"} placement="left">
            <button>
              <SummarizeOutlinedIcon sx={{ color: "#fff" }} />
            </button>
          </Tooltip>
          <Tooltip title={"Справочники"} placement="left">
            <button>
              <AccountTreeOutlinedIcon sx={{ color: "#fff" }} />
            </button>
          </Tooltip>
        </div>
        <LogOut />
      </div>
    </div>
  );
};

export default MainLayouts;
