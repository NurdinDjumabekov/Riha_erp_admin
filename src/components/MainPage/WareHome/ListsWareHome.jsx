////// hooks
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import { setAllProdsWH } from "../../../store/reducers/wareHouseSlice";
import { changeCountAllListWH } from "../../../store/reducers/wareHouseSlice";

////// helpers
import { validNums } from "../../../helpers/validations";
import { sumCountsFN, totalSum } from "../../../helpers/totals";

////// style
import "./style.scss";

const ListsWareHome = () => {
  const dispatch = useDispatch();

  const { allProdsWH } = useSelector((state) => state.wareHouseSlice);

  const onChangeCount = (e, item) => {
    const { product_guid, countOld } = item;
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }

    if (count > countOld) {
      return;
    }

    dispatch(changeCountAllListWH({ count, product_guid }));
    /////изменение ключа count в списке товаров СГП
  };

  const onChangeCheck = (e, { product_guid }) => {
    const newList = allProdsWH?.map((i) => {
      if (i?.product_guid == product_guid) {
        return { ...i, is_checked: !i?.is_checked };
      } else {
        return i;
      }
    });

    // Обновляем состояние с новым списком
    dispatch(setAllProdsWH(newList));
  };

  return (
    <div className="listsWareHome">
      <div className="listsWareHome__inner">
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "100%" }}
          className="scroll_table"
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "5%" }}>№</TableCell>
                <TableCell style={{ width: "55%" }}>Продукт</TableCell>
                <TableCell align="left" style={{ width: "12%" }}>
                  Цена
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  Кол-во
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  *
                </TableCell>
                <TableCell align="left" style={{ width: "8%" }}>
                  *
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allProdsWH?.map((row, index) => (
                <TableRow key={row?.product_guid}>
                  <TableCell component="th" scope="row" style={{ width: "5%" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "55%" }}
                  >
                    {row?.product_name}
                  </TableCell>
                  <TableCell align="left" style={{ width: "12%" }}>
                    {row?.price} сом
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    {row?.countOld}
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    <div className="countsBlock">
                      <input
                        type="text"
                        onChange={(e) => onChangeCount(e, row)}
                        value={row?.count}
                        maxLength={10}
                        className="counts"
                        // readOnly={!checkInvoice}
                      />
                    </div>
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => onChangeCheck(e, row)}
                      className="checkboxInner"
                      name="check"
                      checked={row?.is_checked}
                      // disabled={!checkInvoice}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} align="left" className="footerTable">
                  Итого
                </TableCell>
                <TableCell align="left" className="footerTable">
                  {totalSum(allProdsWH, "count", "price")} сом
                </TableCell>
                <TableCell
                  colSpan={3}
                  align="left"
                  style={{ fontWeight: "bold" }}
                >
                  {sumCountsFN(allProdsWH, "count")} шт (кг)
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListsWareHome;
