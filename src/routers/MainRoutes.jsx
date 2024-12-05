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
import ListApplicationPage from "../pages/ListApplicationPage/ListApplicationPage";
import HistoryApplicationPage from "../pages/HistoryApplicationPage/HistoryApplicationPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ProductionPage from "../pages/ProductionPage/ProductionPage";
import RouterPage from "../pages/RouterPage/RouterPage";
import PayPage from "../pages/PayPage/PayPage";
import ReturnProdsPage from "../pages/ReturnProdsPage/ReturnProdsPage";
import TasksPage from "../pages/TasksPage/TasksPage";
import SpendingPage from "../pages/SpendingPage/SpendingPage";
import WareHomePages from "../pages/WareHomePages/WareHomePages";
import ReportsAgentPage from "../pages/ReportsAgentPages/ReportsAgentPages";

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
            <Route path="/" element={<ListApplicationPage />} />
            <Route
              path="/history_application"
              element={<HistoryApplicationPage />}
            />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/ware_home/*" element={<WareHomePages />} />
            <Route path="/route" element={<RouterPage />} />
            <Route path="/report_ta/*" element={<ReportsAgentPage />} />
            <Route path="/pay" element={<PayPage />} />
            <Route path="/return_prod" element={<ReturnProdsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/spending" element={<SpendingPage />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default MainRoutes;
