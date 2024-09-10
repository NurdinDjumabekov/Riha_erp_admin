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
import ListInvoice from "../../ListInvoice/ListInvoice";
import ListAcceptInvoice from "../../ListAcceptInvoice/ListAcceptInvoice";

////// style
import "./style.scss";

////// fns
import { clearListOrders } from "../../../../store/reducers/requestSlice";
import { getListWorkShop } from "../../../../store/reducers/requestSlice";
import { setInvoiceGuid } from "../../../../store/reducers/requestSlice";

////// icons
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

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

  const clickSort = (type) => setActive(type);

  const noneData = listSendOrders?.length == 0;

  const { guid, action } = invoiceGuid;

  const check = !!guid && (action == 1 || action == 2);

  return (
    <Dialog
      fullScreen
      open={check}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="mainOrders">
        <div className="mainOrders__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                <div className="actionsBtns">
                  <button
                    onClick={() => clickSort(1)}
                    className={active == 1 ? "activeBtn" : ""}
                  >
                    <ContentPasteSearchOutlinedIcon
                      sx={{
                        color: active == 1 ? "#1976d2" : "#fff",
                        width: 16,
                      }}
                    />
                    <p>Заявка</p>
                  </button>
                  {!noneData && (
                    <button
                      onClick={() => clickSort(2)}
                      className={active == 2 ? "activeBtn" : ""}
                    >
                      <InventoryOutlinedIcon
                        sx={{
                          color: active == 2 ? "#1976d2" : "#fff",
                          width: 16,
                        }}
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
