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
import { roundingNum } from "../../../helpers/totals";

/////// fns

const TableReturn = ({ activeInvoice, setActiveInvoice }) => {
  const dispatch = useDispatch();

  const { listInvoiceReturn, listProdsReturn } = useSelector(
    (state) => state.invoiceSlice /// список заявок и товаров каждой заявки возврата
  );

  const clickInvoice = ({ invoice_guid }) => {
    dispatch(getListProdsReturns({ invoice_guid })); // get список товаров возврата
    setActiveInvoice(invoice_guid); //// активная накладная
  };

  return (
    <div className="infoProdsApp">
      <div className="dolg">
        <h5>Накладные</h5>
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
                      {roundingNum(row?.total_price)} сом
                    </TableCell>

                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {/* {objStatusOrdersMini?.[row?.status]} */}
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
      <div className="vozvrat">
        <h5>Товары накладных</h5>
        <div className="dolg__inner">
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "100%" }}
            className="scroll_table standartTable"
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: "8%" }}>
                    №
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Наименование
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Вес
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Кол-во
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Сумма
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listProdsReturn?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "8%" }}
                      align="center"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {row?.product_name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {roundingNum(row?.count)}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {roundingNum(row?.count_per)}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {roundingNum(row?.price)} сом
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="left" className="footerTable">
                    Итого
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listProdsReturn?.[0]?.total_count || 0)}
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listProdsReturn?.[0]?.total_count || 0)}
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listProdsReturn?.[0]?.total_price || 0)} сом
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default TableReturn;
