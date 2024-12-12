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

const ReportSummaryWeekBC = () => {
  const { reportSummary } = useSelector((state) => state.reportsSlice);

  return (
    <div className="reportRealization reportSummaryWeek">
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%" }}
        className="scroll_table standartTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ width: "14%" }}>
                Дата
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Приход (утро)
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Вечер
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Касса
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Возврат
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Расходы
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Остаток на конец
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listWeelSummary?.map((row, index) => (
              <TableRow key={`${row?.guid}`}>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.date}
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.income} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.outcome} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.kassa} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.return} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.spending} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {row?.leftovers_day} сом
                </TableCell>
              </TableRow>
            ))}
            {listWeelSummary?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="left" component="th" scope="row">
                  Итого
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.income_total} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.outcome_total} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.kassa_total} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.return_total} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.spending_total} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row">
                  {listWeelSummary?.leftovers_day_total} сом
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReportSummaryWeekBC;
