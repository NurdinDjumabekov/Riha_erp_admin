////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Select from "react-select";

////// fns
import {
  // addProdInInvoiceTA,
  getListCategsWH,
  getListProdsWH,
} from "../../../store/reducers/wareHouseSlice";

import { setActiveWorkShop } from "../../../store/reducers/selectsSlice";
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import { setActiveCategs } from "../../../store/reducers/selectsSlice";

////// helpers
import { chechEmptyCount, checkBoolFN } from "../../../helpers/validations";
import { myAlert } from "../../../helpers/MyAlert";
import { transformListsWH } from "../../../helpers/transformLists";
import { transformLists } from "../../../helpers/transformLists";

////// style
import "./style.scss";

////// icons
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const SortSendProds = () => {
  const dispatch = useDispatch();

  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs, activeTA } = useSelector((state) => state.selectsSlice);

  const { listWorkshopWH } = useSelector((state) => state.wareHouseSlice);
  const { listCategsWH } = useSelector((state) => state.wareHouseSlice);
  const { allProdsWH } = useSelector((state) => state.wareHouseSlice);
  const { listTA, invoiceGuid } = useSelector((state) => state.wareHouseSlice);
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const workShop = transformLists(listWorkshopWH, "guid", "name");
  const categs = transformLists(listCategsWH, "category_guid", "category_name");
  const sortListTA = transformLists(listTA, "guid", "fio");

  const onChangeWS = (item) => {
    dispatch(setActiveWorkShop(item)); ///// выбор селекта цехов
    dispatch(getListCategsWH(item)); /// для получение категорий
  };

  const onChangeCateg = (item) => {
    dispatch(setActiveCategs(item)); ///// выбор селекта категорий
    const obj = { guid: activeWorkShop?.guid, guidCateg: item?.category_guid };
    dispatch(getListProdsWH(obj));
    /// для получение списка товаров
  };

  const onChangeAgents = (item) => {
    dispatch(setActiveTA(item));
    ///// выбор селекта ТА

    const data = {
      sender_guid: dataSave?.guid, // guid отправителя
      sender_type: 2,
      reciever_guid: item?.guid, // guid получателя
      reciever_type: 1,
      user_guid: dataSave?.guid, // guid человека кто создает
      user_type: 2,
    };

    //// беру список товаров и данные накладной ( заранее созданной накланой)
  };

  const actionsProdInInvoice = () => {
    ///// создание и редактирование твоаров в заявке
    if (checkBoolFN(allProdsWH)) {
      myAlert("Выберите товар", "error");
      return;
    }

    if (chechEmptyCount(allProdsWH)) {
      myAlert("Поля не должны быть пустыми или равны 0", "error");
      return;
    }

    if (invoiceGuid == "") {
      myAlert("Выберите торгового агента", "error");
      return;
    }

    const products = transformListsWH(allProdsWH);

    const data = { products, comment: "", invoice_guid: invoiceGuid };

    const obj = { ...activeCategs, ...activeWorkShop };

    // dispatch(addProdInInvoiceTA({ data, agent_guid: activeTA?.guid, obj }));
    ///// добавление и редактирование товаров в заявке
  };

  return (
    <div className="sortSendProds">
      <div className="sortActions">
        <div className="sortActions__inner">
          <div className="myInputs">
            <h6>Торговые Агенты</h6>
            <Select
              options={sortListTA}
              className="select"
              onChange={onChangeAgents}
              value={activeTA}
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
        </div>
        <button
          className="saveAction"
          onClick={actionsProdInInvoice}
          // disabled={!checkInvoice}
        >
          <LibraryAddIcon sx={{ width: 16, height: 16 }} />
          <p>Добавить</p>
        </button>
      </div>
    </div>
  );
};

export default SortSendProds;
