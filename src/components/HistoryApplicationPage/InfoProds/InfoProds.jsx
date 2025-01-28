////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import DatePicker from "react-datepicker";

/////// helpers
import { objStatusOrdersMini } from "../../../helpers/objs";
import { roundingNum } from "../../../helpers/totals";
import { ru } from "date-fns/locale";
import { addDays, format, parse } from "date-fns";

////// icons
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

/////// fns
import { getListProdsInInvoice } from "../../../store/reducers/mainSlice";
import { activeDateDayFN } from "../../../store/reducers/standartStateSlice";

const InfoProds = (props) => {
  const { activeInvoice, setActiveInvoice, getInvoiceProds } = props;

  const dispatch = useDispatch();

  const { listOrders, listSendOrders } = useSelector(
    (state) => state.mainSlice /// список заявок и товаров каждой заявки
  );
  const { activeAgent } = useSelector((state) => state.standartStateSlice);
  const { activeDateDay } = useSelector((state) => state.standartStateSlice);

  const clickInvoice = ({ invoice_guid }) => {
    setActiveInvoice(invoice_guid); /// для активной накладной
    dispatch(getListProdsInInvoice(invoice_guid)); //// для получения товаров
  };

  const onChangeDate = async (item) => {
    ///// сортировка заявок по дате
    dispatch(activeDateDayFN(format(item, "yyyy-MM-dd", { locale: ru })));

    const data = {
      date_from: format(item, "yyyy-MM-dd", { locale: ru }),
      date_to: format(addDays(item, 1), "yyyy-MM-dd", { locale: ru }),
    };
    const obj = { agents_guid: [activeAgent?.guid] };
    getInvoiceProds({ ...data, ...obj, history: 1 });
  };

  return (
    <div className="infoProdsApp">
      <div className="dolg">
        <div className="header">
          <h4>Заявки</h4>
          <div className="date inputSend">
            <DatePicker
              selected={parse(activeDateDay, "yyyy-MM-dd", new Date())}
              onChange={onChangeDate}
              yearDropdownItemNumber={100}
              placeholderText="ДД.ММ.ГГГГ"
              shouldCloseOnSelect={true}
              scrollableYearDropdown
              dateFormat="dd.MM.yyyy"
              locale={ru}
            />
            <EventIcon />
          </div>
        </div>
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
                          checked={row?.invoice_guid == activeInvoice}
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
                      style={{ width: "15%", color: "#00ab55" }}
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
                    Кол-во (шт)
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Вес (кг)
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Цена
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
                      {roundingNum(row?.count)}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {roundingNum(row?.count_kg)}
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
                    {roundingNum(listSendOrders?.[0]?.total_count) || 0} шт
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listSendOrders?.[0]?.total_count_kg || 0)} кг
                  </TableCell>
                  <TableCell align="left" style={{ fontWeight: "bold" }}>
                    {roundingNum(listSendOrders?.[0]?.total_price) || 0} сом
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
