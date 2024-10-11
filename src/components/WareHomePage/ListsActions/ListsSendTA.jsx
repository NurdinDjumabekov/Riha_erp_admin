////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// helpers
import { sumCountsFN, totalSum } from "../../../helpers/totals";
import { emptyCountCheck } from "../../../helpers/validations";
import { myAlert } from "../../../helpers/MyAlert";

////// icons
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FileCopyIcon from "@mui/icons-material/FileCopy";

/////// fns
import { editProdInInvoiceTA } from "./../../../store/reducers/wareHouseSlice";
import { sendInvoiceTAsale } from "../../../store/reducers/wareHouseSlice";

////// style
import "./style.scss";

const ListsSendTA = () => {
  const dispatch = useDispatch();

  const { listWHProdTA } = useSelector((state) => state.wareHouseSlice);
  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs, activeTA } = useSelector((state) => state.selectsSlice);
  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { invoiceGuid } = useSelector((state) => state.wareHouseSlice);

  const sendInvoiceTA = () => {
    ///// отпуская товар торговвому агенту

    if (emptyCountCheck(listWHProdTA)) {
      myAlert("Поля не должны быть пустыми или равны 0", "error");
      return;
    }

    if (listWHProdTA?.length == 0) {
      myAlert("Список пустой!", "error");
      return;
    }

    const data = {
      invoice_guid: invoiceGuid,
      date_from: "2024-06-09 11:00",
      date_to: "2024-06-09 17:30",
      status: 1, // 1 - потвержден оператором,
      user_guid: dataSave?.guid,
      user_type: 2, // 1 agent 2 admin
      user_type1: 2, // 1 agent 2 admin
    };

    dispatch(sendInvoiceTAsale({ data }));
    ///// добавление и редактирование товаров в заявке
  };

  const clickPdf = () => {
    const url =
      "https://riha-production.333.kg/files/invoice/Otpusk-nakladnaya-5-2024-10-01(18:21:33).pdf";
    window.open(url, "_blank");
  };

  const delProd = ({ product_guid, invoice_guid, price, count }) => {
    const products = [{ product_guid, count, workshop_price: price }];
    const data = { comment: "", status: -1, products, invoice_guid };
    const obj = { ...activeCategs, ...activeWorkShop };
    dispatch(editProdInInvoiceTA({ activeTA, ...obj, data }));
    /// удаление твоара с накладной ТА через запрос (status: -1)
  };

  return (
    <div className="listsWareHome">
      <div className="sendActions">
        <button className="saveAction generatePdf" onClick={clickPdf}>
          <FileCopyIcon sx={{ width: 16, height: 16 }} />
          <p>Сгенерировать документ</p>
        </button>

        <button
          className="saveAction"
          onClick={sendInvoiceTA}
          // disabled={!checkInvoice}
        >
          <NoteAddIcon sx={{ width: 16, height: 16 }} />
          <p>Отпустить товар </p>
        </button>
      </div>
      <div className="listsWareHome__inner">
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
                <TableCell style={{ width: "50%" }}>Продукт</TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  Цена
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
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
              {listWHProdTA?.map((row, index) => (
                <TableRow key={row?.product_guid}>
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    style={{ width: "5%" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "50%" }}
                  >
                    {row?.product_name}
                  </TableCell>
                  <TableCell align="left" style={{ width: "20%" }}>
                    {row?.price} сом
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.count} кг
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <Tooltip
                      title={"Удалить"}
                      placement="top"
                      disableInteractive
                    >
                      <button
                        className="actionsDel"
                        // disabled={!checkInvoice}
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
                  {totalSum(listWHProdTA, "count", "price")} сом
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="left"
                  style={{ fontWeight: "bold" }}
                >
                  {sumCountsFN(listWHProdTA, "count")} кг
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListsSendTA;
