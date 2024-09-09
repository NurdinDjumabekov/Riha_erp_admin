////// hooks
import React from "react";
import { useEffect } from "react";
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

const ListProdCRUD = ({ list }) => {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
              >
                Продукт
              </TableCell>
              <TableCell
                align="left"
                style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
              >
                Цена
              </TableCell>
              <TableCell
                align="left"
                style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                className="titleCheckbox"
              >
                *
              </TableCell>
              <TableCell align="left">Кол-во</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((row) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    width: "65%",
                  }}
                >
                  {row?.product_name}
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    width: "10%",
                  }}
                >
                  {row?.workshop_price} сом
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                    width: "10%",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => onChangeCheck(e, row)}
                    className="checkboxInner"
                    name="check"
                    checked={chechListOrders(listSendOrders, row?.product_guid)}
                  />
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
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                colSpan={3}
                align="left"
                style={{ fontWeight: "bold" }}
              >
                Итоговая сумма: {totalSum(list, "count", "workshop_price")} сом
              </TableCell>
              <TableCell align="left" style={{ fontWeight: "bold" }}>
                {sumCountsFN(list, "count")} шт
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListProdCRUD;
