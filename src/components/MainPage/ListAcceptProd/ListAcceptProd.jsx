////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import {
  changeCountListProds,
  delProdInInvoice,
} from "../../../store/reducers/requestSlice"; /// delete
import { changeCountOrders } from "../../../store/reducers/requestSlice";

////// style
import "./style.scss";

////// helpers
import { chechListOrders } from "../../../helpers/searchActiveOrdersTA";
import { validNums } from "../../../helpers/validations";
import { sumCountsFN, totalSum } from "../../../helpers/totals";

////// icons
import DeleteIcon from "@mui/icons-material/Delete";

const ListAcceptProd = () => {
  const dispatch = useDispatch();

  const { listSendOrders } = useSelector((state) => state.requestSlice);
  const { guid } = useSelector((state) => state.requestSlice?.invoiceInfo);
  const { activeDate } = useSelector((state) => state.requestSlice);
  const { listTA, checkInvoice } = useSelector((state) => state.requestSlice);

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }
    dispatch(changeCountOrders({ ...item, count }));
    /////изменение ключа count в списке товаров временной корзины
  };

  const delProd = (product_guid, invoice_guid) => {
    const data = { product_guid, invoice_guid };
    const obj = { listTA, activeDate, action: 3 };
    dispatch(delProdInInvoice({ data, ...obj, guid }));
    ///// удаление твоара с накладной через запрос
  };

  return (
    <div className="listProdCRUD">
      <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
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
                className="titleCheckbox "
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSendOrders?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell component="th" scope="row" style={{ width: "5%" }}>
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "60%" }}>
                  {row?.product_name}
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  {row?.price} сом
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
                <TableCell align="center" style={{ width: "10%" }}>
                  <Tooltip title={"Удалить"} placement="top" disableInteractive>
                    <button
                      className="actionsDel"
                      disabled={!checkInvoice}
                      onClick={() =>
                        delProd(row?.product_guid, row?.invoice_guid)
                      }
                    >
                      <DeleteIcon
                        sx={{
                          color: "rgba(213, 42, 42, 0.848)",
                          width: 20,
                          height: 20,
                        }}
                      />
                    </button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="left" className="footerTable">
                Итого
              </TableCell>
              <TableCell align="left" className="footerTable">
                {totalSum(listSendOrders, "count", "price")} сом
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                style={{ fontWeight: "bold" }}
              >
                {sumCountsFN(listSendOrders, "count")} шт
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListAcceptProd;
