////// hooks
import * as React from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListProdCRUD from "../ListProdCRUD/ListProdCRUD";
import debounce from "debounce";
import Select from "react-select";

////// style
import "./style.scss";

////// helpers
import { transformLists } from "../../../helpers/transformLists";
import { myAlert } from "../../../helpers/MyAlert";
import { chechEmptyCount } from "../../../helpers/validations";

////// fns
import { setActiveWorkShop } from "../../../store/reducers/selectsSlice";
import { setActiveCategs } from "../../../store/reducers/selectsSlice";
import { createEditProdInInvoice } from "../../../store/reducers/requestSlice";
import { getListCategs } from "../../../store/reducers/requestSlice";
import { getListProds } from "../../../store/reducers/requestSlice";
import { getListWorkShop } from "../../../store/reducers/requestSlice";
import { searchListProds } from "../../../store/reducers/requestSlice";
import { objActionInvoice } from "../../../helpers/objs";

////// icons
import AddBoxIcon from "@mui/icons-material/AddBox";

const ListInvoice = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");

  const { listWorkshop } = useSelector((state) => state.requestSlice);
  const { listCategs, listTA } = useSelector((state) => state.requestSlice);
  const { listSendOrders } = useSelector((state) => state.requestSlice);
  const { activeDate } = useSelector((state) => state.requestSlice);
  const { invoiceGuid } = useSelector((state) => state.requestSlice);
  const { listProds } = useSelector((state) => state.requestSlice);

  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs } = useSelector((state) => state.selectsSlice);

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
    ///// создание и редактирование твоаров в заявке
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
    dispatch(
      createEditProdInInvoice({ forGetInvoice, forCreate, invoiceGuid })
    );
    ///// добавление и редактирование товаров в заявке
  };

  return (
    <div className="listInvoice">
      <div className="selectsAll">
        <div className="selectsAll__inner">
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
        </div>

        <button className="saveAction" onClick={actionsProdInInvoice}>
          {objActionInvoice?.[invoiceGuid?.action]?.img}
          <p>{objActionInvoice?.[invoiceGuid?.action]?.text}</p>
        </button>
      </div>

      <ListProdCRUD list={listProds} />
    </div>
  );
};

export default ListInvoice;
