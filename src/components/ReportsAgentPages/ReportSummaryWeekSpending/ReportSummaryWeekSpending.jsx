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

const ReportSummaryWeekSpending = ({ list }) => {
  return (
    <div className="reportRealization reportSummaryWeekPoints">
      <h5>Траты агента</h5>
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
                  №
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Время
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Комментарий
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Сумма
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((row, index) => (
                <TableRow key={row?.guid}>
                  <TableCell align="center" style={{ width: "10%" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.date_time}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.comment || "..."}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.sum} сом
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
                    {list?.[0]?.total_sum} сом
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

export default ReportSummaryWeekSpending;
