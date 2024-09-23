////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import { delProdInInvoiceSI } from "../../../store/reducers/invoiceSlice";
import { changeCountOrdersSI } from "../../../store/reducers/invoiceSlice";

////// style
import "./style.scss";

////// helpers
import { validNums } from "../../../helpers/validations";
import { sumCountsFN, totalSum } from "../../../helpers/totals";

////// icons
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const ListAcceptProdSI = ({ editProdInInvoice }) => {
  const dispatch = useDispatch();

  const { listSendOrdersSI } = useSelector((state) => state.invoiceSlice);
  const { activeDate } = useSelector((state) => state.mainSlice);
  const { listTA, checkInvoice } = useSelector((state) => state.mainSlice);

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }
    dispatch(changeCountOrdersSI({ ...item, count }));
    /////изменение ключа count в списке товаров временной корзины
  };

  const delProd = ({ product_guid, invoice_guid, price, count }) => {
    const products = [{ product_guid, count, workshop_price: price }];
    const data = { invoice_guid, comment: "", status: -1, products };
    const obj = { listTA, activeDate, action: 3 };
    dispatch(delProdInInvoiceSI({ data, ...obj, invoice_guid }));
    ///// удаление твоара с накладной через запрос
  };

  return (
    <div className="listProdCRUD acceptSI">
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
                className="titleCheckbox "
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSendOrdersSI?.map((row, index) => (
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
                      onClick={() => delProd(row)}
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
                {totalSum(listSendOrdersSI, "count", "price")} сом
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                style={{ fontWeight: "bold" }}
              >
                {sumCountsFN(listSendOrdersSI, "count")} шт
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <button
        className="saveAction mobileBtn"
        onClick={() => editProdInInvoice()}
      >
        <LibraryAddIcon sx={{ color: "#fff" }} />
        <p>Отпустить накладную</p>
      </button>
    </div>
  );
};

export default ListAcceptProdSI;
