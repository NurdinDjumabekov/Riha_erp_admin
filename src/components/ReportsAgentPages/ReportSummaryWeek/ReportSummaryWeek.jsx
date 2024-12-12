////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import { listWeelSummary } from "../../../helpers/LocalData";

////// fns

////// icons

///// helpers

const ReportSummaryWeek = () => {
  const { reportSummary } = useSelector((state) => state.reportsSlice);

  return <div className="reportSummaryWeek"></div>;
};

export default ReportSummaryWeek;
