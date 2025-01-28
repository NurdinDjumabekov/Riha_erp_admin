////// hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import GeneratePdfProduction from "../GeneratePdfProduction/GeneratePdfProduction";
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import LeftoversProduction from "../LeftoversProduction/LeftoversProduction";
import DatePicker from "react-datepicker";

////// fns
import {
  getListInvoiceProduction,
  getListProdsProduction,
} from "../../../store/reducers/productionSlice";
import { sendInWareHomeFN } from "../../../store/reducers/productionSlice";
import { activeDateDayFN } from "../../../store/reducers/standartStateSlice";

////// style
import "./style.scss";

////// helpers
import { emptyCountCheck, validNums } from "../../../helpers/validations";
import { myAlert } from "../../../helpers/MyAlert";
import { roundingNum } from "../../../helpers/totals";
import { ru } from "date-fns/locale";
import { format, parse } from "date-fns";

////// icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import arrow from "../../../assets/icons/arrowMenu.svg";
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

const ListData = () => {
  const dispatch = useDispatch();

  const [activeInvoice, setActiveInvoice] = useState({});

  const { activeDateDay } = useSelector((state) => state.standartStateSlice);
  const { listProductionInvoice, listProductionProds } = useSelector(
    (state) => state.productionSlice
  );

  const onChangeCount = (e, item) => {
    const count_kg = e?.target?.value?.replace(",", ".");

    if (validNums(count_kg)) {
      //// валидцаия на числа
      return;
    }

    /////изменение ключа count в списке товаров производства
  };

  const clickInvoice = (item) => {
    if (item?.invoice_guid == activeInvoice?.invoice_guid) return;
    setActiveInvoice(item);
    dispatch(getListProdsProduction(item));
  };

  const sendInWareHome = () => {
    //// отправить с производства на склад
    // const products = listProduction?.map(
    //   ({ product_guid, count_kg, price }) => {
    //     return { product_guid, count: count_kg, workshop_price: price };
    //   }
    // );
    // const data = { products, invoice_guid: activeInvoice?.invoice_guid };
    // dispatch(sendInWareHomeFN({ data, listTA, activeDate, setActiveInvoice }));
    // ///  отправка товаров на склад через функцию
    // if (listProductionInvoice?.length === 1) {
    //   const obj = { guid: "", action: 0, listInvoice: [], setActiveInvoice };
    //   dispatch(setInvoiceInfo(obj));
    //   /// для закрытия модалки только когда отправляется послдений список
    // }
  };

  useEffect(() => {
    getStartData();
  }, []);

  const getStartData = async () => {
    const date_from = format(activeDateDay, "yyyy-MM-dd", { locale: ru });
    const res = await dispatch(
      getListInvoiceProduction({ date_from, setActiveInvoice })
    ).unwrap();
    if (!!res?.[0]?.invoice_guid) {
      const send = { invoice_guid: res?.[0]?.invoice_guid };
      dispatch(getListProdsProduction(send)).unwrap();
    }
  };

  const onChangeDate = async (item) => {
    ///// сортировка заявок по дате
    const date_from = format(item, "yyyy-MM-dd", { locale: ru });
    dispatch(activeDateDayFN(date_from));
    dispatch(getListInvoiceProduction({ date_from, setActiveInvoice }));
  };

  return (
    <div div className="productionData">
      <div className="productionData__inner">
        <div className="invoices">
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
          <div className="invoices__inner scroll_table_hover">
            {listProductionInvoice?.length == 0 ? (
              <div className="emptyDataInner">
                <p>Список пустой</p>
              </div>
            ) : (
              listProductionInvoice?.map((item) => (
                <div
                  className={`invoices__every ${
                    item?.invoice_guid == activeInvoice?.invoice_guid
                      ? "active"
                      : ""
                  }`}
                  onClick={() => clickInvoice(item)}
                >
                  <div className="info">
                    <div className="info__inner">
                      <div>
                        <h6>
                          Дата создания: <b>{item?.date_from}</b>
                        </h6>
                        <div>
                          <p>Накладная № {item?.codeid}</p>
                        </div>
                      </div>
                      <div className="arrowRight">
                        <img src={arrow} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mainList">
          <div className="prods">
            <div className="prods__sortDate">
              {/* <GeneratePdfProduction activeInvoice={activeInvoice} /> */}
              <button onClick={sendInWareHome} className="sendData">
                <AddBusinessIcon sx={{ width: 16 }} />
                <p>Отправить на склад</p>
              </button>
            </div>
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
                    <TableCell style={{ width: "35%" }}>Продукт</TableCell>
                    <TableCell align="left" style={{ width: "12%" }}>
                      Вес (кг)
                    </TableCell>
                    {/* <TableCell align="left" style={{ width: "12%" }}>
                      Разница (кг)
                    </TableCell> */}
                    <TableCell align="left" style={{ width: "18%" }}>
                      Дата начала изготовления
                    </TableCell>
                    <TableCell align="left" style={{ width: "18%" }}>
                      Дата окончания изготовления
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProductionProds?.map((row, index) => (
                    <TableRow key={row?.product_guid}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "5%" }}
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "35%" }}
                      >
                        {row?.product_name}
                      </TableCell>
                      <TableCell align="left" style={{ width: "12%" }}>
                        {roundingNum(+row?.count_kg)} кг
                      </TableCell>
                      {/* <TableCell align="left" style={{ width: "12%" }}>
                        <div className="countsBlock">
                          <input
                            type="text"
                            onChange={(e) => onChangeCount(e, row)}
                            value={row?.count_kg}
                            maxLength={10}
                            className="counts"
                          />
                          <div>
                            {row?.count_kg != row?.countOld && (
                              <Tooltip
                                title={"Кол-во не сходится"}
                                placement="right-start"
                              >
                                <ErrorOutlineIcon
                                  sx={{ color: "rgba(228, 30, 30, 0.719)" }}
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell align="left" style={{ width: "18%" }}>
                        {activeInvoice?.date_from || "..."}
                      </TableCell>
                      <TableCell align="left" style={{ width: "18%" }}>
                        {activeInvoice?.date_to || "..."}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* <LeftoversProduction /> */}
        </div>
      </div>
    </div>
  );
};

export default ListData;
