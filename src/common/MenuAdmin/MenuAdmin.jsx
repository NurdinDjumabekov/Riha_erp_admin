///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

////// style
import "./style.scss";

///// components
import LogOut from "../../components/ActionSettings/LogOut/LogOut";
import { Tooltip } from "@mui/material";

////// helpers
import { listMenu } from "../../helpers/objs";

////// fns
import { setInvoiceInfo } from "../../store/reducers/mainSlice";

const MenuAdmin = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [active, setActive] = useState("/");
  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  const handleChange = (link, id) => {
    setActive(link);
    dispatch(setInvoiceInfo({ ...invoiceInfo, action: id }));
  };

  useEffect(() => {
    setActive(location?.pathname);
  }, [location?.pathname]);

  return (
    <div className="actionSettings">
      <div className="actionSettings__inner">
        {listMenu?.map(({ title, icon, id, link }) => (
          <Tooltip
            key={id}
            title={<p style={{ fontSize: 15, padding: 5 }}>{title}</p>}
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
  );
};

export default MenuAdmin;
