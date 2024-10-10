///// hooks
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

///// components
import LogOut from "../../components/ActionSettings/LogOut/LogOut";
import { Tooltip } from "@mui/material";

////// helpers
import { listMenu } from "../../helpers/objs";

////// fns
import { setInvoiceInfo } from "../../store/reducers/mainSlice";

///// icons
import logo from "../../assets/images/rihaLogo.png";
import twoArrow from "../../assets/icons/twoArrow.svg";
import arrowRight from "../../assets/icons/arrowMenu.svg";

const MenuAdmin = ({ active, setActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  const clickPage = (link) => navigate(link);

  return (
    <div className="actionSettings">
      <div className={`actionSettings__inner ${active ? "" : "activeHeader"}`}>
        <h1 className={active ? "" : "activeLogo"}>
          <img src={logo} alt="logo" />
          <button onClick={() => setActive(!active)}>
            {active ? (
              <img src={twoArrow} alt="<<" />
            ) : (
              <img src={twoArrow} alt="<<" className="rotate" />
            )}
          </button>
        </h1>
        <div className={`menuBlocks ${active ? "" : "menuBlocksActive"}`}>
          <span>Меню</span>
        </div>
        {listMenu?.map(({ title, icon, id, link }) => (
          <>
            {active ? (
              <div
                className={pathname == link ? "activeMenu" : ""}
                onClick={() => clickPage(link)}
              >
                <button>{icon}</button>
                <p>{title}</p>
                <img src={arrowRight} alt=">" className="navArrow" />
              </div>
            ) : (
              <Tooltip
                key={id}
                title={<p style={{ fontSize: 15, padding: 5 }}>{title}</p>}
                placement="left"
                arrow
                onClick={() => clickPage(link)}
              >
                <div
                  className={pathname == link ? "activeMenu" : ""}
                  onClick={() => clickPage(link)}
                >
                  <button>{icon}</button>
                </div>
              </Tooltip>
            )}
          </>
        ))}
      </div>
      <LogOut active={active} />
    </div>
  );
};

export default MenuAdmin;
