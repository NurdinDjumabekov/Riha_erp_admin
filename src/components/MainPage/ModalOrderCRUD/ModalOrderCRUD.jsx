////// hooks
import * as React from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import ListProdCRUD from "../ListProdCRUD/ListProdCRUD";
import debounce from "debounce";

////// style
import "./style.scss";

////// helpers
import { transformLists } from "../../../helpers/transformLists";
import { myAlert } from "../../../helpers/MyAlert";
import { chechEmptyCount } from "../../../helpers/validations";

////// fns
import { setActiveWorkShop } from "../../../store/reducers/selectsSlice";
import { setActiveCategs } from "../../../store/reducers/selectsSlice";
import { createProdInInvoice } from "../../../store/reducers/requestSlice";
import { setInvoiceGuid } from "../../../store/reducers/requestSlice";
import { getListCategs } from "../../../store/reducers/requestSlice";
import { getListProds } from "../../../store/reducers/requestSlice";
import { getListWorkShop } from "../../../store/reducers/requestSlice";
import { searchListProds } from "../../../store/reducers/requestSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalOrderCRUD = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");

  const { listWorkshop } = useSelector((state) => state.requestSlice);
  const { listCategs, listTA } = useSelector((state) => state.requestSlice);
  const { listSendOrders } = useSelector((state) => state.requestSlice);
  const { invoiceGuid } = useSelector((state) => state.requestSlice);
  const { activeDate } = useSelector((state) => state.requestSlice);

  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs } = useSelector((state) => state.selectsSlice);

  const handleClose = () => dispatch(setInvoiceGuid({ guid: "", action: 0 }));

  const workShop = transformLists(listWorkshop, "guid", "name");
  const categs = transformLists(listCategs, "category_guid", "category_name");

  const onChangeWS = (item) => {
    dispatch(setActiveWorkShop(item)); ///// выбор селекта цехов
    dispatch(getListCategs(item)); /// для получение категорий
  };

  const onChangeCateg = (item) => {
    dispatch(setActiveCategs(item)); ///// выбор селекта категорий

    const obj = { guid: activeWorkShop?.guid, guidCateg: item?.category_guid };
    dispatch(getListProds(obj));
    /// для получение списка товаров
  };

  const onChangeComm = (e) => {
    const value = e.target.value;
    if (value?.includes("'")) {
      return;
    }
    setComment(value);
  };

  const handleSearch = useCallback(
    //// поиск товара через запрос
    debounce((value) => {
      dispatch(searchListProds(value));
    }, 500),
    []
  );

  const onChangeSearch = (e) => {
    const value = e?.target?.value;
    setSearch(value);

    if (value.length === 0) {
      dispatch(getListWorkShop());
    } else {
      handleSearch(value);
    }
  };

  const actionsProdInInvoice = () => {
    ///// создание и редактиирование твоаров в заявке
    if (listSendOrders?.length === 0) {
      myAlert("Выберите товар", "error");
      return;
    }

    if (chechEmptyCount(listSendOrders)) {
      myAlert("Поля не должны быть пустыми или равны 0", "error");
      return;
    }

    const forCreate = { listSendOrders, comment };
    const forGetInvoice = { activeDate, listTA };
    dispatch(createProdInInvoice({ forGetInvoice, forCreate, invoiceGuid }));
    ///// добавление и редактирование товаров в заявке
  };

  const objAction = { 1: "Сохранить", 2: "Редактировать" };

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
              <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                <Button autoFocus color="inherit" className="countsAll">
                  Количество выбранных товаров
                  <p>{listSendOrders?.length}</p>
                </Button>
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
        <div className="selectsAll">
          <div className="myInputs">
            <h6>Поиск товаров </h6>
            <input
              type="text"
              className="input"
              onChange={onChangeSearch}
              value={search}
            />
          </div>
          <div className="myInputs">
            <h6>Цех</h6>
            <Select
              options={workShop}
              className="select"
              onChange={onChangeWS}
              value={activeWorkShop}
            />
          </div>
          <div className="myInputs">
            <h6>Категории</h6>
            <Select
              options={categs}
              className="select"
              onChange={onChangeCateg}
              value={activeCategs}
            />
          </div>
          <div className="myInputs">
            <h6>Комментарий</h6>
            <input
              type="text"
              className="input"
              value={comment}
              onChange={onChangeComm}
            />
          </div>
          <button className="saveAction" onClick={actionsProdInInvoice}>
            {objAction?.[invoiceGuid?.action]}
          </button>
        </div>

        <ListProdCRUD />
      </div>
    </Dialog>
  );
};

export default ModalOrderCRUD;
