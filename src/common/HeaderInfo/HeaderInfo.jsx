import React from "react";

import user from "../../assets/images/iAm.jpg";

////// style
import "./style.scss";
import { useSelector } from "react-redux";

const HeaderInfo = ({ active, setActive }) => {
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  return (
    <div className={`headerInfo ${active ? "" : "headerInfo__active"}`}>
      <div className="headerInfo__inner">
        <div className="infoUser">
          <div className="info">
            <h6>{dataSave?.fio || "Джумабеков Нурдин"}</h6>
            <p>{dataSave?.phone || "0700754454"}</p>
          </div>
          <div className="logo">
            <img src={user} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderInfo;
