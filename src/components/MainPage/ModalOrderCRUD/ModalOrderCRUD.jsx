////// hooks
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";

////// style
import "./style.scss";

////// fns
import {
  clearListOrders,
  getListWorkShop,
  setInvoiceGuid,
} from "../../../store/reducers/requestSlice";

////// icons
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ListInvoice from "../ListInvoice/ListInvoice";
import ListAcceptInvoice from "../ListAcceptInvoice/ListAcceptInvoice";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalOrderCRUD = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState(1); // 1,2

  const { invoiceGuid } = useSelector((state) => state.requestSlice);
  const { listSendOrders } = useSelector((state) => state.requestSlice);

  const handleClose = () => dispatch(setInvoiceGuid({ guid: "", action: 0 }));

  const objType = { 1: <ListInvoice />, 2: <ListAcceptInvoice /> };
  //ListInvoice - список всех товаров,
  //ListAcceptInvoice - список выбранных т0варов

  useEffect(() => {
    if (!!invoiceGuid?.guid) {
      dispatch(getListWorkShop({ listInner: true }));
      //// срабатывает только тогда, когда модалка открывается
      dispatch(clearListOrders());
      ///// очищаю временный список для отправки создания заказа от ТА
      setActive(invoiceGuid?.action); //// для показа галвного списка
    }
  }, [!!invoiceGuid?.guid]);

  const clickSort = (type) => {
    setActive(type);
    dispatch(getListWorkShop({ listInner: true }));
  };

  const noneData = listSendOrders?.length == 0;

  return (
    <Dialog
      fullScreen
      open={!!invoiceGuid?.guid}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="mainOrders">
        <div className="mainOrders__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                <div className="actionsBtns">
                  <button onClick={() => clickSort(1)}>
                    <ContentPasteSearchOutlinedIcon
                      sx={{ color: "#1976d2", width: 16 }}
                    />
                    <p>Заявка</p>
                  </button>
                  {!noneData && (
                    <button onClick={() => clickSort(2)}>
                      <InventoryOutlinedIcon
                        sx={{ color: "#1976d2", width: 16 }}
                      />
                      <p>Выбранные товары</p>
                    </button>
                  )}
                </div>
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
        {objType?.[active]}
      </div>
    </Dialog>
  );
};

export default ModalOrderCRUD;
