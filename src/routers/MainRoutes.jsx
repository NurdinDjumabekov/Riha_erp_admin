////hooks
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//// pages
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import MainLayouts from "../layouts/MainLayouts/MainLayouts";

//// components
// import { Preloader } from "../components/Preloader/Preloader";
// import Alerts from "../components/Alerts/Alerts";

////fns

import MainPage from "../pages/MainPage/MainPage";
import LoginPage from "../pages/LoginPage/LoginPage";

const MainRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { dataSave } = useSelector((state) => state.saveDataSlice);

  console.log(dataSave, "dataSave");

  return (
    <>
      <Routes>
        {!!!dataSave?.guid ? (
          <Route path="/" element={<LoginPage />} />
        ) : (
          <Route element={<MainLayouts />}>
            <Route path="/" element={<MainPage />} />
          </Route>
        )}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      {/* <Alerts />
      <Preloader /> */}
    </>
  );
};

export default MainRoutes;
