////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import { changeCountCheckedListProds } from "../../../store/reducers/mainSlice";
import { setListProds } from "../../../store/reducers/mainSlice";

////// helpers
import { validNums } from "../../../helpers/validations";

////// style
import "./style.scss";

const ListProds = () => {
  const dispatch = useDispatch();

  const { listProds } = useSelector((state) => state.mainSlice);
  const { checkInvoice } = useSelector((state) => state.mainSlice);

  const onChangeCheck = (e, { product_guid }) => {
    const newList = listProds?.map((i) => {
      if (i?.product_guid === product_guid) {
        return { ...i, is_checked: !i?.is_checked }; // Используем текущее значение из массива
      } else {
        return i;
      }
    });

    // Обновляем состояние с новым списком
    dispatch(setListProds(newList));
  };

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }

    dispatch(changeCountCheckedListProds({ ...item, count }));
    /////изменение ключа count в списке товаров
  };

  return (
    <div className="listProdCRUD">
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
            {listProds?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ width: "5%" }}
                >
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
                  <div className="checkboxTable">
                    <input
                      type="checkbox"
                      onChange={(e) => onChangeCheck(e, row)}
                      name="check"
                      checked={row?.is_checked}
                      disabled={!checkInvoice}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListProds;
