////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// style
import "./style.scss";

////// helpers
import { roundingNum } from "../../../helpers/totals";

const ReportRealization = ({ list, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("sadas");
  }, []);

  return (
    <div className="reportRealization">
      <div className="title">
        <h5>{title}</h5>
      </div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%" }}
        className="scroll_table standartTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: "5%" }}>
                №
              </TableCell>
              <TableCell align="left" style={{ width: "41%" }}>
                Наименование
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Цена
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Отгружено (кг)
              </TableCell>
              <TableCell align="left" style={{ width: "14%" }}>
                Отгружено (шт)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row, index) => (
              <TableRow key={`${row?.product_guid}`}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ width: "5%" }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  align="left"
                  component="th"
                  scope="row"
                  style={{ width: "41%" }}
                >
                  {row?.product_name}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "14%" }}>
                  {roundingNum(row?.price) || 0} сом
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {roundingNum(row?.count_kg) || 0}
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {roundingNum(row?.count) || 0}
                </TableCell>
              </TableRow>
            ))}
            {list?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell align="left" component="th" scope="row" colSpan={2}>
                  Итого
                </TableCell>
                <TableCell align="left" component="th" scope="row" colSpan={1}>
                  {list?.[0]?.total_price_all || 0} сом
                </TableCell>
                <TableCell align="left" component="th" scope="row" colSpan={1}>
                  {list?.[0]?.total_count_kg || 0}
                </TableCell>
                <TableCell align="left" component="th" scope="row" colSpan={1}>
                  {list?.[0]?.total_count || 0}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReportRealization;
