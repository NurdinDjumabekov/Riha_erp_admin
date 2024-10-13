////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

/////// helpers
import { objStatusOrdersMini } from "../../../helpers/objs";
import { getListProdsReturns } from "../../../store/reducers/invoiceSlice";
import AddSpending from "../AddSpending/AddSpending";

/////// fns

const TableSpendings = ({ activeInvoice, setActiveInvoice }) => {
  const dispatch = useDispatch();

  const { listInvoiceReturn, listProdsReturn } = useSelector(
    (state) => state.invoiceSlice /// список заявок и товаров каждой заявки возврата
  );

  const clickInvoice = ({ invoice_guid }) => {
    dispatch(getListProdsReturns(invoice_guid)); // get список товаров возврата
    setActiveInvoice(invoice_guid); //// активная накладная
  };

  return (
    <div className="infoProdsApp">
      <div className="dolg">
        <h5>Заявки</h5>
        <div className="dolg__inner">
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
                  <TableCell align="center" style={{ width: "5%" }}>
                    ...
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    ФИО
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Дата создания
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Дата исполнения
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Сумма
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Статус
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Комментарий
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listInvoiceReturn?.map((row) => (
                  <TableRow
                    key={row?.codeid}
                    onClick={() => clickInvoice(row)}
                    className="everyInvoice"
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "5%" }}
                      align="center"
                    >
                      {row?.codeid}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "5%" }}
                    >
                      <div className="checkboxTable">
                        <input
                          type="checkbox"
                          name="check"
                          checked={row?.invoice_guid === activeInvoice}
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row?.agent}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row?.date}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row?.date_from}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row?.total_price} сом
                    </TableCell>

                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {objStatusOrdersMini?.[row?.status]}
                    </TableCell>

                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      Накладная {row?.invoice_codeid}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddSpending />
    </div>
  );
};

export default TableSpendings;
