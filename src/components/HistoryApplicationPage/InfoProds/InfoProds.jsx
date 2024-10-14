import { ru } from "date-fns/locale";

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
import { transformActionDate } from "../../../helpers/transformDate";

/////// fns
import { getListProdsInInvoice } from "../../../store/reducers/mainSlice";
import { setActiveInvoiceHistory } from "../../../store/reducers/mainSlice";
import { roundingNum } from "../../../helpers/totals";

const InfoProds = ({}) => {
  const dispatch = useDispatch();

  const { listOrders, listSendOrders, activeInvoiceHistory } = useSelector(
    (state) => state.mainSlice /// список заявок и товаров каждой заявки
  );

  const clickInvoice = ({ invoice_guid }) => {
    dispatch(setActiveInvoiceHistory(invoice_guid)); /// для активной накладной
    dispatch(getListProdsInInvoice(invoice_guid)); //// для получения товаров
  };

  console.log(listSendOrders);

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
                {listOrders?.map((row) => (
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
                          checked={row?.invoice_guid === activeInvoiceHistory}
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
      <div className="vozvrat">
        <h5>Товары заявки</h5>
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
                {listSendOrders?.map((row, index) => (
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
                      {roundingNum(row?.count)} кг
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {roundingNum(row?.count_per)} шт
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
                    {roundingNum(listSendOrders?.[0]?.total_count)} кг
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listSendOrders?.[0]?.total_count)} шт
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listSendOrders?.[0]?.total_price)} сом
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

export default InfoProds;
