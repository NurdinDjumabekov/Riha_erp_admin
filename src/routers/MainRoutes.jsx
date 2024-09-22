////hooks
import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//// pages
import NotFoundPage from "../pages/NotFound/NotFoundPage";
import MainLayouts from "../layouts/MainLayouts/MainLayouts";

//// components
// import { Preloader } from "../components/Preloader/Preloader";

////fns

/////// pages
import MainPage from "../pages/MainPage/MainPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import PayPage from "../pages/PayPage/PayPage";
import MapsPage from "../pages/MapsPage/MapsPage";
import CameraPage from "../pages/CameraPage/CameraPage";

const MainRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { listProds, listTA } = useSelector((state) => state.mainSlice);
  const { listTitleOrders } = useSelector((state) => state.mainSlice);
  const { listOrders, invoiceInfo } = useSelector((state) => state.mainSlice);

  // console.log(listTitleOrders, "listTitleOrders");
  // console.log(dataSave, "dataSave");

  return (
    <>
      <Routes>
        {/* {false ? ( */}
        {!!!dataSave?.guid ? (
          <Route path="/" element={<LoginPage />} />
        ) : (
          <Route element={<MainLayouts />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pay" element={<PayPage />} />
          </Route>
        )}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      {/*<Preloader  /> */}
    </>
  );
};

export default MainRoutes;
/// user_type 2 - админ, 1 - агент

// @media (max-width: 700px) {
//   background: red;
// }
