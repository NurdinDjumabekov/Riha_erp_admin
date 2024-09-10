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

const ModaIngridients = () => {
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
              <Typography
                sx={{ flex: 1 }}
                variant="h6"
                component="div"
              ></Typography>
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
        {/* {objType?.[active]} */}
      </div>
    </Dialog>
  );
};

export default ModaIngridients;
