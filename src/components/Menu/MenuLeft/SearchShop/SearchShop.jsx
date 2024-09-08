import React from "react";

////// imgs
import logo from "../../../../assets/images/rihaLogo.png";

////// style
import "./style.scss";

const SearchShop = () => {
  return (
    <div className="searchShop">
      {/* <button className="logo">
        <img src={logo} alt="" />
      </button> */}
      <input type="text" placeholder="Поиск цехов" />
    </div>
  );
};

export default SearchShop;
