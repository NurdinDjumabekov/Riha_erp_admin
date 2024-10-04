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
import MapsPage from "../pages/MapsPage/MapsPage";
import CameraPage from "../pages/CameraPage/CameraPage";
import SendInvoicePage from "../pages/SendInvoicePage/SendInvoicePage";
import AllAgentsPage from "../pages/AllAgentsPage/AllAgentsPage";
import MyInvoicePage from "../pages/MyInvoicePage/MyInvoicePage";
import AcceptInvoicePage from "../pages/AcceptInvoicePage/AcceptInvoicePage";
import LookPdfPage from "../pages/LookPdfPage/LookPdfPage";
import AddPointsPage from "../pages/AddPointsPage/AddPointsPage";

const MainRoutes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { listProds, listTA } = useSelector((state) => state.mainSlice);
  const { listTitleOrders } = useSelector((state) => state.mainSlice);
  const { listOrders, invoiceInfo } = useSelector((state) => state.mainSlice);
  const { activeRouteList } = useSelector((state) => state.photoSlice);
  const { mapGeo, listRouteAllTA } = useSelector((state) => state.mapSlice);

  return (
    <Routes>
      {!!!dataSave?.guid ? (
        <Route path="/" element={<LoginPage />} />
      ) : (
        <>
          <Route element={<MainLayouts />}>
            <Route path="/" element={<MainPage />} />
            {/* ///// agentPages */}
            <Route path="/my_invoice" element={<MyInvoicePage />} />
            <Route path="/accept_invoice" element={<AcceptInvoicePage />} />
            <Route path="/view/:url" element={<LookPdfPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/maps" element={<MapsPage />} />
            <Route path="/add_points" element={<AddPointsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route
            path="/send_app/:route_guid/:guid_point"
            element={<SendInvoicePage />}
          />
          <Route
            path="/maps_camera/:route_guid/:guid_point"
            element={<CameraPage />}
          />
        </>
      )}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default MainRoutes;
/// user_type 2 - админ, 1 - агент

// @media (max-width: 700px) {
//   background: red;
// }
