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

////// helpers

const ListSearchTA = (props) => {
  const { active, clickAgent } = props;

  const { listTA } = useSelector((state) => state.mainSlice);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredList = listTA?.filter((item) =>
    item?.fio?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const checkLength = filteredList?.length > 14;

  return (
    <div className={`listTAInfo searchAgent`}>
      <input
        placeholder="Поиск агентов"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => clickAgent(i?.guid)}
            className={active == i?.guid ? "active" : ""}
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
