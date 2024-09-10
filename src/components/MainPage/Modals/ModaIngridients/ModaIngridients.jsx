////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// style
import "./style.scss";

////// fns
import { setInvoiceGuid } from "../../../../store/reducers/requestSlice";

////// icons
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModaIngridients = () => {
  const dispatch = useDispatch();

  const { invoiceGuid } = useSelector((state) => state.requestSlice);
  const { dataIngredients } = useSelector((state) => state.requestSlice);
  const { listSendOrders } = useSelector((state) => state.requestSlice);

  const handleClose = () => dispatch(setInvoiceGuid({ guid: "", action: 0 }));

  console.log(dataIngredients, "dataIngredients");

  return (
    <Dialog
      fullScreen
      open={invoiceGuid?.action == 3}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="mainBlockIngrid">
        <div className="mainBlockIngrid__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ marginRight: 5 }} variant="p" component="div">
                Кол-во агентов: {dataIngredients?.agents_counts}
              </Typography>
              <Typography sx={{ marginRight: 5 }} variant="p" component="div">
                Сумма: {dataIngredients?.total_sum} сом
              </Typography>
              <Typography
                sx={{ marginRight: 5, flex: 1 }}
                variant="p"
                component="div"
              >
                Общее кол-во: {dataIngredients?.total_count}
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <div className="mainBlockIngrid__table">
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "3%" }}>№</TableCell>
                  <TableCell style={{ width: "62%" }}>Продукт</TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Цена
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    Кол-во/вес
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width: "10%" }}
                    className="titleCheckbox"
                  >
                    *
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataIngredients?.list_ingredient?.map((row, index) => (
                  <TableRow hover key={row?.product_guid}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "3%" }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "62%" }}
                    >
                      {row?.name}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      {row?.total_price} сом
                    </TableCell>
                    <TableCell align="left" style={{ width: "15%" }}>
                      {row?.amount}
                      {/* <input
                        type="text"
                        onChange={(e) => onChangeCount(e, row)}
                        name="counts"
                        value={row?.count}
                        maxLength={10}
                        className="counts"
                      /> */}
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      {/* <input
                        type="checkbox"
                        onChange={(e) => onChangeCheck(e, row)}
                        className="checkboxInner"
                        name="check"
                        checked={chechListOrders(
                          listSendOrders,
                          row?.product_guid
                        )}
                      /> */}
                    </TableCell>
                  </TableRow>
                ))}
                {/* {footer && (
                  <TableRow>
                    <TableCell colSpan={2} align="left" className="footerTable">
                      Итого
                    </TableCell>
                    <TableCell align="left" className="footerTable">
                      {totalSum(list, "count", "workshop_price")} сом
                    </TableCell>
                    <TableCell
                      colSpan={2}
                      align="left"
                      style={{ fontWeight: "bold" }}
                    >
                      {sumCountsFN(list, "count")} шт
                    </TableCell>
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Dialog>
  );
};

export default ModaIngridients;
