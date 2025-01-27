////// hooks
import { useState } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// fns
import { activeSearchAgentsFN } from "../../../../store/reducers/standartStateSlice";

const SearchShop = (props) => {
  const dispatch = useDispatch();

  const { activeSearchAgents } = useSelector(
    (state) => state.standartStateSlice
  );

  const onChange = (e) => {
    const value = e?.target?.value;
    dispatch(activeSearchAgentsFN(value));
  };

  return (
    <div className="searchShop">
      <input
        type="search"
        placeholder="Поиск агентов"
        onChange={onChange}
        value={activeSearchAgents}
      />
    </div>
  );
};

export default SearchShop;
