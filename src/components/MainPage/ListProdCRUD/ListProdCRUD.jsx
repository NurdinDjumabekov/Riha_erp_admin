////// hooks
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import {
  addDataOrders,
  clearDataOrders,
  delDataOrders,
  getListWorkShop,
} from "../../../store/reducers/requestSlice";

////// style
import "./style.scss";

const ListProdCRUD = ({ modalOrder }) => {
  const dispatch = useDispatch();

  const { listProds, listSendOrders } = useSelector(
    (state) => state.requestSlice
  );

  //   console.log(listProds);

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

  console.log(listSendOrders, "listSendOrders");

  useEffect(() => {
    if (modalOrder) {
      dispatch(getListWorkShop({ listInner: true }));
      //// срабатывает только тогда, когда модалка открывается
      dispatch(clearDataOrders());
      ///// очищаю временный список для отправки создания заказа от ТА
    }
  }, [modalOrder]);

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
            {listProds?.map((row) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {row?.product_name}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  {row?.workshop_price} сом
                </TableCell>
                <TableCell
                  align="left"
                  style={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}
                >
                  <input
                    type="checkbox"
                    onChange={(e) => onChangeCheck(e, row)}
                    className="checkboxInner"
                    name="check"
                  />
                </TableCell>
                <TableCell align="left">
                  <input
                    type="text"
                    // onChange={(e) => onChange(e, row)}
                    name="counts"
                    value={"1"}
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

export default ListProdCRUD;
