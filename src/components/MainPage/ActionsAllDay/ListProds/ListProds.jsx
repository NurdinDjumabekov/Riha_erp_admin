import React from "react";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// helpers
import { roundingNum, sumCountsFN, totalSum } from "../../../../helpers/totals";

const ListProds = ({ list }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ height: "99%", width: "60%" }}
      className="scroll_table standartTable"
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ width: "5%" }}>
              №
            </TableCell>
            <TableCell style={{ width: "44%" }}>Продукт</TableCell>
            <TableCell align="left" style={{ width: "17%" }}>
              Цена
            </TableCell>
            <TableCell align="left" style={{ width: "17%" }}>
              Вес
            </TableCell>
            <TableCell align="left" style={{ width: "17%" }}>
              Кол-во
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.map((row, index) => (
            <TableRow hover key={index}>
              <TableCell
                align="center"
                component="th"
                scope="row"
                style={{ width: "5%" }}
              >
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row" style={{ width: "44%" }}>
                {row?.product_name}
              </TableCell>
              <TableCell align="left" style={{ width: "17%" }}>
                {roundingNum(row?.total_price)} сом
              </TableCell>
              <TableCell align="left" style={{ width: "17%" }}>
                {roundingNum(row?.total_count)} кг
              </TableCell>
              <TableCell align="left" style={{ width: "17%" }}>
                {roundingNum(row?.count_per)} шт
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align="left" className="footerTable">
              Итого
            </TableCell>
            <TableCell align="left" className="footerTable">
              {roundingNum(totalSum(list, "total_count", "total_price"))} сом
            </TableCell>
            <TableCell colSpan={1} align="left" style={{ fontWeight: "bold" }}>
              {roundingNum(sumCountsFN(list, "total_count"))} кг
            </TableCell>
            <TableCell colSpan={1} align="left" style={{ fontWeight: "bold" }}>
              {roundingNum(sumCountsFN(list, "count_per"))} шт
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListProds;
