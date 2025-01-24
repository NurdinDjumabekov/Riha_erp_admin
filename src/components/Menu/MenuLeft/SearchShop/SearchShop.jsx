import { useState } from "react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

////// imgs

////// style
import "./style.scss";

////// components

////// fns

const SearchShop = (props) => {
  const { search, setSearch } = props;

  const dispatch = useDispatch();

  const onChange = (e) => {
    const value = e?.target?.value;
    setSearch(value);
  };

  return (
    <div className="searchShop">
      <input
        type="search"
        placeholder="Поиск агентов"
        onChange={onChange}
        value={search}
      />
    </div>
  );
};

export default SearchShop;
