////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import { addDataOrders } from "../../../store/reducers/requestSlice";
import { changeCountListProds } from "../../../store/reducers/requestSlice";
import { changeCountOrders } from "../../../store/reducers/requestSlice";
import { delDataOrders } from "../../../store/reducers/requestSlice";

////// style
import "./style.scss";

////// helpers
import { chechListOrders } from "../../../helpers/searchActiveOrdersTA";
import { validNums } from "../../../helpers/validations";
import { sumCountsFN, totalSum } from "../../../helpers/totals";

const ListAcceptProd = ({ list }) => {
  const dispatch = useDispatch();

  const { listSendOrders } = useSelector((state) => state.requestSlice);

  const onChangeCheck = (e, item) => {
    const checked = e?.target?.checked;

    if (checked) {
      dispatch(addDataOrders(item));
      //// добавление во времннуб корзину
    } else {
      //// удаление с временной корзины
      dispatch(delDataOrders(item));
    }
  };

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }

    const check = chechListOrders(listSendOrders, item?.product_guid);
    dispatch(changeCountListProds({ ...item, count }));
    /////изменение ключа count в списке товаров
    if (check) {
      dispatch(changeCountOrders({ ...item, count }));
      /////изменение ключа count в списке товаров временной корзины
    }
  };

  console.log(list, "list");

  return (
    <div className="listProdCRUD">
      <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "5%" }}>№</TableCell>
              <TableCell style={{ width: "60%" }}>Продукт</TableCell>
              <TableCell align="left" style={{ width: "10%" }}>
                Цена
              </TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
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
            {list?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell component="th" scope="row" style={{ width: "5%" }}>
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "60%" }}>
                  {row?.product_name}
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  {row?.price} сом
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  <input
                    type="text"
                    onChange={(e) => onChangeCount(e, row)}
                    name="counts"
                    value={row?.count}
                    maxLength={10}
                    className="counts"
                  />
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => onChangeCheck(e, row)}
                    className="checkboxInner"
                    name="check"
                    checked={chechListOrders(listSendOrders, row?.product_guid)}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="left" className="footerTable">
                Итого
              </TableCell>
              <TableCell align="left" className="footerTable">
                {totalSum(list, "count", "price")} сом
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                style={{ fontWeight: "bold" }}
              >
                {sumCountsFN(list, "count")} шт
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListAcceptProd;
