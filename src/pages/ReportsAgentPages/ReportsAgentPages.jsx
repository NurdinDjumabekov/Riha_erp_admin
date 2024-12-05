////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";

////// icons

///// components
import ListAgentsPage from "./ListAgentsPage/ListAgentsPage";
import EveryAgentPage from "./EveryAgentPage/EveryAgentPage";

const ReportsAgentPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getListTA());
  }, []);

  return (
    <Routes>
      {/* <Route path="/" element={<ReportsAgentPages />} /> */}
      <Route path="/agents" element={<ListAgentsPage />} />
      <Route path="/agent_every" element={<EveryAgentPage />} />
    </Routes>
  );
};

export default ReportsAgentPages;
