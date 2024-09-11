import React from "react";

////// components
import { Table, TableBody, TableCell, TableFooter } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import { sumCountsFN, totalSum } from "../../../../helpers/totals";

const ListProds = ({ list }) => {
  return (
    <TableContainer component={Paper} sx={{ height: "99%", width: "60%" }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "5%" }}>№</TableCell>
            <TableCell style={{ width: "52%" }}>Продукт</TableCell>
            <TableCell align="left" style={{ width: "25%" }}>
              Цена
            </TableCell>
            <TableCell align="left" style={{ width: "23%" }}>
              Кол-во/вес
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.map((row, index) => (
            <TableRow hover key={index}>
              <TableCell component="th" scope="row" style={{ width: "5%" }}>
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row" style={{ width: "52%" }}>
                {row?.product_name}
              </TableCell>
              <TableCell align="left" style={{ width: "25%" }}>
                {row?.total_price} сом
              </TableCell>
              <TableCell align="left" style={{ width: "23%" }}>
                {row?.total_count}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={2} align="left" className="footerTable">
              Итого
            </TableCell>
            <TableCell align="left" className="footerTable">
              {totalSum(list, "total_count", "total_price")} сом
            </TableCell>
            <TableCell colSpan={2} align="left" style={{ fontWeight: "bold" }}>
              {sumCountsFN(list, "total_count")} шт
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListProds;
