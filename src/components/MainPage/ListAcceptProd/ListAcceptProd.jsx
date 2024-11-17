////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// fns
import { delProdInInvoice } from "../../../store/reducers/mainSlice"; /// delete
import { changeCountOrders } from "../../../store/reducers/mainSlice";

////// style
import "./style.scss";

////// helpers
import { validNums } from "../../../helpers/validations";
import { roundingNum, sumCountsFN, totalSum } from "../../../helpers/totals";
import { styleIconDel } from "../../../helpers/objs";

////// icons
import DeleteIcon from "@mui/icons-material/Delete";

const ListAcceptProd = () => {
  const dispatch = useDispatch();

  const { listSendOrders } = useSelector((state) => state.mainSlice);
  const { guid } = useSelector((state) => state.mainSlice?.invoiceInfo);
  const { activeDate } = useSelector((state) => state.mainSlice);
  const { listTA, checkInvoice } = useSelector((state) => state.mainSlice);

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидация на числа
      return;
    }
    dispatch(changeCountOrders({ ...item, count }));
  };

  const incrementCount = (item) => {
    const newCount = (parseFloat(item?.count) || 0) + 1;
    dispatch(changeCountOrders({ ...item, count: newCount.toString() }));
  };

  const decrementCount = (item) => {
    const newCount = Math.max((parseFloat(item?.count) || 0) - 1, 0); // Минимальное значение - 0
    dispatch(changeCountOrders({ ...item, count: newCount.toString() }));
  };

  const delProd = ({ product_guid, invoice_guid, price, count }) => {
    const products = [{ product_guid, count, workshop_price: price }];
    const data = { invoice_guid, comment: "", status: -1, products };
    const obj = { listTA, activeDate, action: 3 };
    dispatch(delProdInInvoice({ data, ...obj, guid }));
  };

  return (
    <div className="listAcceptProd">
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%" }}
        className="scroll_table standartTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "8%" }} align="center">
                №
              </TableCell>
              <TableCell style={{ width: "39%" }}>Продукт</TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
                Кол-во (шт)
              </TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
                Вес (кг)
              </TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
                Цена
              </TableCell>
              <TableCell
                align="left"
                style={{ width: "8%" }}
                className="titleCheckbox"
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSendOrders?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  component="th"
                  scope="row"
                  align="center"
                  style={{ width: "8%" }}
                  // onClick={() => decrementCount(row)}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ width: "39%" }}
                  // onClick={() => decrementCount(row)}
                >
                  {row?.product_name}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ width: "15%" }}
                  className="counterRow"
                >
                  <div className="countInputContainer">
                    <input
                      type="text"
                      onChange={(e) => onChangeCount(e, row)}
                      name="counts"
                      value={row?.count}
                      maxLength={10}
                      className="counts"
                      readOnly={!checkInvoice}
                    />
                  </div>
                </TableCell>
                <TableCell
                  align="left"
                  style={{ width: "15%" }}
                  // onClick={() => incrementCount(row)}
                >
                  {roundingNum(row?.count_kg)}
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  {roundingNum(row?.price)} сом
                </TableCell>
                <TableCell align="center" style={{ width: "8%" }}>
                  <Tooltip title={"Удалить"} placement="top" disableInteractive>
                    <button
                      className="actionsDel"
                      disabled={!checkInvoice}
                      onClick={() => delProd(row)}
                    >
                      <DeleteIcon sx={styleIconDel} />
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
                {roundingNum(listSendOrders?.[0]?.total_count)} шт
              </TableCell>
              <TableCell align="left" className="footerTable">
                {roundingNum(listSendOrders?.[0]?.total_count_kg)} кг
              </TableCell>
              <TableCell
                colSpan={2}
                align="left"
                style={{ fontWeight: "bold" }}
              >
                {roundingNum(listSendOrders?.[0]?.total_price)} сом
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ListAcceptProd;
