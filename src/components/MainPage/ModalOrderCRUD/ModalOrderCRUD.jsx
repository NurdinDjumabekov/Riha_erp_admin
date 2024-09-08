////// hooks
import * as React from "react";
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

////// style
import "./style.scss";

////// components
import ListProdCRUD from "../ListProdCRUD/ListProdCRUD";

////// helpers
import { transformLists } from "../../../helpers/transformLists";

////// fns
import { setActiveWorkShop } from "../../../store/reducers/selectsSlice";
import { setActiveCategs } from "../../../store/reducers/selectsSlice";
import {
  getListCategs,
  getListProds,
} from "../../../store/reducers/requestSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalOrderCRUD = ({ props }) => {
  const { modalOrder, setModalOrder } = props;

  const dispatch = useDispatch();

  const { listWorkshop } = useSelector((state) => state.requestSlice);
  const { listCategs } = useSelector((state) => state.requestSlice);

  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs } = useSelector((state) => state.selectsSlice);

  const handleClickOpen = () => setModalOrder(true);

  const handleClose = () => setModalOrder(false);

  ///// transforms list for selects
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

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}></Button>
      <Dialog
        fullScreen
        open={modalOrder}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div className="mainOrders">
          <div className="mainOrders__inner">
            <AppBar sx={{ position: "relative" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Добавление заявки
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                  Сохранить
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="selectsAll">
            <div className="myInputs">
              <h6>Поиск товаров </h6>
              <input type="text" className="input" />
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
              <input type="text" className="input" />
            </div>
            <button className="saveAction">Сохранить</button>
          </div>

          <ListProdCRUD modalOrder={modalOrder} />
        </div>
      </Dialog>
    </>
  );
};

export default ModalOrderCRUD;
