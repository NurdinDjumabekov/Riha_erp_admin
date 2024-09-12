///// hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";
import { moreInfo } from "./style";

////// components
import MenuLeft from "../../components/Menu/MenuLeft/MenuLeft";
import LogOut from "../../components/ActionSettings/LogOut/LogOut";
import { Tooltip } from "@mui/material";

/////// fns
import {
  getListTA,
  getListWorkShop,
  setInvoiceInfo,
} from "../../store/reducers/mainSlice";

////// helpers
import { listMenu } from "../../helpers/objs";
import { useState } from "react";

const MainLayouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("/");
  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  useEffect(() => {
    dispatch(getListWorkShop());
    dispatch(getListTA({ first: true }));
  }, [dispatch]);

  const handleChange = (link, id) => {
    setActive(link);
    dispatch(setInvoiceInfo({ ...invoiceInfo, action: id }));
  };

  useNavigate(() => {
    setActive(location?.pathname);
  }, [location?.pathname]);

  return (
    <div className="layouts">
      <div className="pages">
        <Outlet />
      </div>
      <div className="actionSettings">
        <div className="actionSettings__inner">
          {listMenu?.map(({ title, icon, id, link }) => (
            <Tooltip
              key={id}
              title={<p style={moreInfo}>{title}</p>}
              placement="left"
              arrow
              onClick={() => handleChange(link, id)}
            >
              <div className={active == link ? "activeMenu111" : ""}>
                <button>{icon}</button>
              </div>
            </Tooltip>
          ))}
        </div>
        <LogOut />
      </div>
    </div>
  );
};

export default MainLayouts;
