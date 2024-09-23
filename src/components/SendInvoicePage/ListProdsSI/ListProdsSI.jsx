////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import { setListProdsSI } from "../../../store/reducers/invoiceSlice";
import { changeCountCheckedListProdsSI } from "../../../store/reducers/invoiceSlice";

////// helpers
import { validNums } from "../../../helpers/validations";

////// style
import "./style.scss";

const ListProdsSI = () => {
  const dispatch = useDispatch();

  const { listProdsSI } = useSelector((state) => state.invoiceSlice);
  const { checkInvoice } = useSelector((state) => state.invoiceSlice);

  const onChangeCheck = (e, { product_guid }) => {
    const newList = listProdsSI?.map((i) => {
      if (i?.product_guid === product_guid) {
        return { ...i, is_checked: !i?.is_checked };
      } else {
        return i;
      }
    });

    dispatch(setListProdsSI(newList));
  };

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }

    dispatch(changeCountCheckedListProdsSI({ ...item, count }));
    /////изменение ключа count в списке товаров
  };

  return (
    <div className="listProdCRUD">
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%" }}
        className="scroll_table"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "5%" }}>№</TableCell>
              <TableCell style={{ width: "60%" }}>Продукт</TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
                Цена
              </TableCell>
              <TableCell align="left" style={{ width: "10%" }}>
                Кол-во
              </TableCell>
              <TableCell
                align="left"
                style={{ width: "10%" }}
                className="titleCheckbox"
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listProdsSI?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell component="th" scope="row" style={{ width: "5%" }}>
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "60%" }}>
                  {row?.product_name}
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  {row?.workshop_price} сом
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  <input
                    type="text"
                    onChange={(e) => onChangeCount(e, row)}
                    name="counts"
                    value={row?.count}
                    maxLength={10}
                    className="counts"
                    readOnly={!checkInvoice}
                  />
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => onChangeCheck(e, row)}
                    className="checkboxInner"
                    name="check"
                    checked={row?.is_checked}
                    disabled={!checkInvoice}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListProdsSI;
