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

////// fns

////// icons

///// helpers

const ReportSummaryWeekPoints = ({ list, title, firstTitle, firstKey }) => {
  return (
    <div className="reportRealization reportSummaryWeekPoints">
      <h5>{title}</h5>
      <div className="reportSummaryWeekPoints__inner">
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "100%" }}
          className="scroll_table standartTable"
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: "10%" }}>
                  {firstTitle}
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Наименование
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Адрес
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Долг
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((row) => (
                <TableRow key={row?.guid}>
                  <TableCell align="center" style={{ width: "10%" }}>
                    {row?.[firstKey]}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.name}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.address || "..."}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.dolg} сом
                  </TableCell>
                </TableRow>
              ))}
              {list?.length == 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell align="center" component="th" scope="row">
                    Итого
                  </TableCell>
                  <TableCell
                    align="left"
                    component="th"
                    scope="row"
                    colSpan={2}
                  ></TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {list?.[0]?.total_bs_points} сом
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ReportSummaryWeekPoints;
