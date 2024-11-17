////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import Select from "react-select";
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";

/////// helpers
import { roundingNum } from "../../../helpers/totals";
import { myAlert } from "../../../helpers/MyAlert";
import { transformActionDate } from "../../../helpers/transformDate";

////// fns
import {
  editStatusInvoiceReturn,
  getListInvoiceReturns,
  getListProdsReturns,
} from "../../../store/reducers/invoiceSlice";

/////// icons
import EditIcon from "../../../assets/MyIcons/EditIcon";

const TableReturn = (props) => {
  const { activeInvoice, setActiveInvoice } = props;
  const { dateRange, active } = props;

  const dispatch = useDispatch();

  const [data, setData] = React.useState({});

  const { listInvoiceReturn, listProdsReturn } = useSelector(
    (state) => state.invoiceSlice /// список заявок и товаров каждой заявки возврата
  );

  const clickInvoice = ({ invoice_guid }) => {
    dispatch(getListProdsReturns({ invoice_guid })); // get список товаров возврата
    setActiveInvoice(invoice_guid); //// активная накладная
  };

  const obj = { 2: "Принят", 0: "Отклонён", 1: "Ожидание" };

  const onChangeSel = (status) => setData({ ...data, status });

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const editStatusInvoice = async () => {
    const send = {
      status: data?.status?.value,
      invoice_guid: data?.invoice_guid,
    };
    const res = await dispatch(editStatusInvoiceReturn(send)).unwrap();
    if (!!res?.result) {
      myAlert("Накладная принята");
      setData({});

      const sendData = {
        reciever_guid: "b85094a9-d70a-46ab-a724-5f3d7a506b37",
        sender_guid: active,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[1]),
      };
      const invoices = await dispatch(getListInvoiceReturns(sendData)).unwrap(); // get список накладных возврата
      dispatch(getListProdsReturns(invoices?.[0]?.invoice_guid)); // get список товаров возврата
      setActiveInvoice(invoices?.[0]?.invoice_guid); //// активная накладная
    }
  };

  const listStatus = [
    { label: "Принять", value: 2 },
    { label: "Отклонить", value: -1 },
  ];

  return (
    <>
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
                    <TableCell align="left" style={{ width: "12%" }}>
                      Сумма
                    </TableCell>
                    <TableCell align="left" style={{ width: "12%" }}>
                      ...
                    </TableCell>
                    <TableCell align="left" style={{ width: "6%" }}>
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
                        style={{ width: "10%" }}
                      >
                        {row?.date_from}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "12%" }}
                      >
                        {roundingNum(row?.total_price)} сом
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "12%" }}
                      >
                        {obj?.[row?.status]}
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "6%" }}
                      >
                        <div className="actions">
                          <button onClick={() => setData(row)}>
                            <EditIcon width={17} height={17} />
                          </button>
                        </div>
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
                        {roundingNum(row?.count_kg)} кг
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "23%" }}
                      >
                        {roundingNum(row?.count)} шт
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
      <div className="addTasks addSpending">
        <Modals
          openModal={!!data?.codeid}
          closeModal={() => setData({})}
          title={"Изменение статуса накладной возврата"}
        >
          <div className="addTasks__inner">
            <div className="myInputs">
              <h6>Статус</h6>
              <Select
                options={listStatus} /// listStatusSpending
                className="select"
                onChange={onChangeSel}
                value={data?.status}
              />
            </div>

            <SendInput
              value={data?.comment}
              onChange={onChange}
              title={"Комментарий"}
              name={"comment"}
              typeInput={"textarea"}
            />

            <div className="sendBlock">
              <button onClick={editStatusInvoice}>+ Сохранить</button>
            </div>
          </div>
        </Modals>
      </div>
    </>
  );
};

export default TableReturn;
