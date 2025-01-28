////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components

////// style
import "./style.scss";

////// icons
import arrow from "../../assets/icons/arrowMenu.svg";

////// fns
import { activeSearchAgentsFN } from "../../store/reducers/standartStateSlice";

////// helpers

const ListSearchTA = (props) => {
  const { clickAgent } = props;

  const dispatch = useDispatch();

  const { listTA } = useSelector((state) => state.mainSlice);
  const { activeSearchAgents, activeAgent } = useSelector(
    (state) => state.standartStateSlice
  );

  const filteredList = listTA?.filter((item) =>
    item?.fio?.toLowerCase()?.includes(activeSearchAgents?.toLowerCase())
  );

  const checkLength = filteredList?.length > 14;

  return (
    <div className={`listTAInfo searchAgent`}>
      <input
        placeholder="Поиск агентов"
        value={activeSearchAgents}
        onChange={(e) => dispatch(activeSearchAgentsFN(e?.target?.value))}
        type="search"
      />
      <div className="line"></div>
      <div
        className={`listTAInfo__inner scroll_table ${
          checkLength ? "lookScroll" : "noLookScroll"
        }`}
      >
        {filteredList?.map((i) => (
          <button
            key={i?.guid}
            onClick={() => clickAgent(i)}
            className={activeAgent?.guid == i?.guid ? "active" : ""}
          >
            <div className="content">
              <p>{i?.fio}</p>
              <span>Баланс: {i?.balance} сом</span>
            </div>

            <div className="arrowRight">
              <img src={arrow} alt="" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListSearchTA;
