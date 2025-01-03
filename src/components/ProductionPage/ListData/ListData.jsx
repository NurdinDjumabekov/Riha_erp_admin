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

////// fns
import { changeCountProduction } from "../../../store/reducers/productionSlice";
import { getListProdProduction } from "../../../store/reducers/productionSlice";
import { sendInWareHomeFN } from "../../../store/reducers/productionSlice";
import { setListProduction } from "../../../store/reducers/productionSlice";
import { setInvoiceInfo } from "../../../store/reducers/mainSlice";

////// style
import "./style.scss";

////// helpers
import { emptyCountCheck, validNums } from "../../../helpers/validations";
import { myAlert } from "../../../helpers/MyAlert";
import { roundingNum } from "../../../helpers/totals";

////// icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

const ListData = () => {
  const dispatch = useDispatch();

  const [activeInvoice, setActiveInvoice] = useState({});

  const { listTA, activeDate } = useSelector((state) => state.mainSlice);
  const { listProduction, listProductionInvoice } = useSelector(
    (state) => state.productionSlice
  );

  const onChangeCount = (e, item) => {
    const count_kg = e?.target?.value?.replace(",", ".");

    if (validNums(count_kg)) {
      //// валидцаия на числа
      return;
    }

    dispatch(changeCountProduction({ ...item, count_kg }));
    /////изменение ключа count в списке товаров производства
  };

  const clickInvoice = (item) => {
    setActiveInvoice(item);
    const list = item?.products?.map((i) => ({ ...i, countOld: i?.count_kg }));
    dispatch(setListProduction(list));
  };

  const sendInWareHome = () => {
    //// отправить с производства на склад
    if (emptyCountCheck(listProduction)) {
      myAlert("Поля не должны быть пустыми или равны 0", "error");
      return;
    }

    if (listProduction?.length == 0) {
      myAlert("Список пустой!", "error");
      return;
    }

    const products = listProduction?.map(
      ({ product_guid, count_kg, price }) => {
        return { product_guid, count: count_kg, workshop_price: price };
      }
    );

    const data = { products, invoice_guid: activeInvoice?.invoice_guid };
    dispatch(sendInWareHomeFN({ data, listTA, activeDate, setActiveInvoice }));
    ///  отправка товаров на склад через функцию

    if (listProductionInvoice?.length === 1) {
      const obj = { guid: "", action: 0, listInvoice: [], setActiveInvoice };
      dispatch(setInvoiceInfo(obj));
      /// для закрытия модалки только когда отправляется послдений список
    }
  };

  useEffect(() => {
    const obj = { date_from: "", date_to: "", setActiveInvoice };
    dispatch(getListProdProduction(obj));
  }, []);

  console.log(listProduction, "listProduction");

  return (
    <div div className="productionData">
      <div className="productionData__inner">
        <div className="invoices scroll_table_hover">
          {listProductionInvoice?.length == 0 ? (
            <div className="emptyDataInner">
              <p>Список пустой</p>
            </div>
          ) : (
            listProductionInvoice?.map((item) => (
              <div
                className="invoices__every"
                onClick={() => clickInvoice(item)}
              >
                <div className="checkboxTable">
                  <input
                    type="checkbox"
                    name="check"
                    checked={item?.invoice_guid == activeInvoice?.invoice_guid}
                  />
                </div>
                <div>
                  <h6>Дата создания: {item?.date_from}</h6>
                  <p>{item?.comment}</p>
                </div>
              </div>
            ))
          )}
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
                    <TableCell align="left" style={{ width: "12%" }}>
                      Разница (кг)
                    </TableCell>
                    <TableCell align="left" style={{ width: "18%" }}>
                      Дата начала изготовления
                    </TableCell>
                    <TableCell align="left" style={{ width: "18%" }}>
                      Дата окончания изготовления
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listProduction?.map((row, index) => (
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
                        {roundingNum(+row?.countOld)} кг
                      </TableCell>
                      <TableCell align="left" style={{ width: "12%" }}>
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
                      </TableCell>
                      <TableCell align="left" style={{ width: "18%" }}>
                        {activeInvoice?.date_from}
                      </TableCell>
                      <TableCell align="left" style={{ width: "18%" }}>
                        {activeInvoice?.date_to}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <LeftoversProduction />
        </div>
      </div>
    </div>
  );
};

export default ListData;
