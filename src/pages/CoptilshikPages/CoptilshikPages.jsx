////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

////// fns

////// icons

///// components
import ProductionPage from "./ProductionPage/ProductionPage";
import InfoCoptilshikPage from "./InfoCoptilshikPage/InfoCoptilshikPage";
import LeftoversProdPage from "./LeftoversProdPage/LeftoversProdPage";

const CoptilshikPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {}, []);

  return (
    <Routes>
      <Route path="/main" element={<ProductionPage />} />
      <Route path="/coptil" element={<InfoCoptilshikPage />} />
      <Route path="/leftovers" element={<LeftoversProdPage />} />
    </Routes>
  );
};

export default CoptilshikPages;
