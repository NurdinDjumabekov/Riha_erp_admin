////// hooks
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import Select from "react-select";

////// fns
import { setInvoiceInfo } from "../../../../store/reducers/mainSlice";
import { changeCountProduction } from "../../../../store/reducers/productionSlice";
import { sendInWareHomeFN } from "../../../../store/reducers/productionSlice";
import { setListProduction } from "../../../../store/reducers/productionSlice";
import { getListProdProduction } from "../../../../store/reducers/productionSlice";
import { clearSelects } from "../../../../store/reducers/selectsSlice";
import { setActiveTA } from "../../../../store/reducers/selectsSlice";

////// style
import "./style.scss";

////// helpers
import { getTodayDate } from "../../../../helpers/transformDate";
import { formatDateOnly } from "../../../../helpers/transformDate";
import { emptyCountCheck, validNums } from "../../../../helpers/validations";
import { myAlert } from "../../../../helpers/MyAlert";
import { sumCountsFN, totalSum } from "../../../../helpers/totals";
import { getDaysOfCurrentMonth } from "../../../../helpers/weeks";

////// icons
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalProduction = () => {
  const dispatch = useDispatch();

  const { invoiceInfo } = useSelector((state) => state.mainSlice);
  const { listProduction } = useSelector((state) => state.productionSlice);
  const { listTA, activeDate } = useSelector((state) => state.mainSlice);
  const { activeTA } = useSelector((state) => state.selectsSlice);

  const handleClose = () => {
    const obj = { guid: "", action: 0, listInvoice: [] };
    dispatch(setInvoiceInfo(obj));
  };

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      //// валидцаия на числа
      return;
    }
    dispatch(changeCountProduction({ ...item, count }));
    /////изменение ключа count в списке товаров производства
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

    const products = listProduction?.map(({ product_guid, count, price }) => ({
      product_guid,
      count,
      workshop_price: price,
    }));

    const data = { products, invoice_guid: listProduction?.[0]?.invoice_guid };
    dispatch(sendInWareHomeFN({ data, listTA, activeDate }));
    ///  отправка товаров на склад через функцию
  };

  console.log(activeTA, "activeTA");

  const onChangeAgents = (item) => {
    dispatch(setActiveTA(item));
    ///// выбор селекта ТА

    dispatch(getListProdProduction({ date: item?.value }));
  };

  useEffect(() => {
    if (invoiceInfo?.action == 4) {
      dispatch(getListProdProduction({ date: getTodayDate() }));
      //// get товары в производстве
    } else {
      dispatch(setListProduction([]));
      dispatch(clearSelects());
      //// при закрытии модалки очищаю списки
    }
  }, [invoiceInfo?.action]);

  return (
    <Dialog
      fullScreen
      open={invoiceInfo?.action == 4}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="modalProduction">
        <div className="modalProduction__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Производство
              </Typography>
              <span>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </span>
            </Toolbar>
          </AppBar>
        </div>

        <div className="modalProduction__sortDate">
          <div>
            <div className="myInputs">
              <h6>Выберите дату</h6>
              <Select
                options={getDaysOfCurrentMonth()}
                className="select"
                onChange={onChangeAgents}
                value={activeTA}
              />
            </div>
          </div>
          <button
            onClick={sendInWareHome}
            className="sendData"
            //   disabled={!checkInvoice}
          >
            <AddBusinessIcon sx={{ width: 16 }} />
            <p>Отправить на склад</p>
          </button>
        </div>

        <div className="modalProduction__invoice">
          <TableContainer component={Paper} sx={{ maxHeight: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "5%" }}>№</TableCell>
                  <TableCell style={{ width: "53%" }}>Продукт</TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Цена
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Количество
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Разница
                  </TableCell>
                  <TableCell align="left" style={{ width: "12%" }}>
                    Дата изготовления
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
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "53%" }}
                    >
                      {row?.product_name}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      {row?.price} сом
                    </TableCell>

                    <TableCell align="left" style={{ width: "10%" }}>
                      {row?.countOld}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      <div className="countsBlock">
                        <input
                          type="text"
                          onChange={(e) => onChangeCount(e, row)}
                          value={row?.count}
                          maxLength={10}
                          className="counts"
                          // readOnly={!checkInvoice}
                        />
                        <div>
                          {row?.count != row?.countOld && (
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
                    <TableCell align="left" style={{ width: "12%" }}>
                      {formatDateOnly(row?.date)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="left" className="footerTable">
                    Итого
                  </TableCell>
                  <TableCell align="left" className="footerTable">
                    {totalSum(listProduction, "count", "price")} сом
                  </TableCell>
                  <TableCell
                    colSpan={3}
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    {sumCountsFN(listProduction, "count")} шт (кг)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalProduction;
