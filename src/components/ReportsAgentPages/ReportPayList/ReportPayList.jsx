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

const ReportPayList = ({ list, title, titleTableCenter, titleKeyCenter }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div className="reportPayList">
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
              <TableCell align="left" style={{ width: "30%" }}>
                Наименование
              </TableCell>
              <TableCell align="left" style={{ width: "35%" }}>
                {titleTableCenter}
              </TableCell>
              <TableCell align="left" style={{ width: "30%" }}>
                Сумма
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
                  {row?.name}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "14%" }}>
                  {row?.[titleKeyCenter] || "..."}
                </TableCell>
                <TableCell align="left" style={{ width: "14%" }}>
                  {roundingNum(row?.balance) || 0} сом
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
              <></>
              // <TableRow>
              //   <TableCell align="left" component="th" scope="row" colSpan={3}>
              //     Итоговая сумма
              //   </TableCell>
              //   <TableCell align="left" component="th" scope="row" colSpan={1}>
              //     {list?.[0]?.total_count_kg || 0}
              //   </TableCell>
              // </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReportPayList;
