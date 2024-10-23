////// hooks
import React from "react";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import Select from "react-select";
import debounce from "debounce";

/////// fns
import {
  addEveryProd,
  getDefaultList,
  getEveryDataDay,
} from "../../../../store/reducers/mainSlice";
import { getListCategs } from "../../../../store/reducers/mainSlice";
import { getListProds } from "../../../../store/reducers/mainSlice";
import { getListWorkShop } from "../../../../store/reducers/mainSlice";
import { searchListProds } from "../../../../store/reducers/mainSlice";
import { changeCountListProds } from "../../../../store/reducers/mainSlice";
import { setActiveWorkShop } from "../../../../store/reducers/selectsSlice";
import { setActiveCategs } from "../../../../store/reducers/selectsSlice";

////// helpers
import { validNums } from "../../../../helpers/validations";
import { transformLists } from "../../../../helpers/transformLists";
import { myAlert } from "../../../../helpers/MyAlert";
import { searchActiveOrdersTA } from "../../../../helpers/searchActiveOrdersTA";

/////// style
import "./style.scss";

/////// icons
import AddBoxIcon from "@mui/icons-material/AddBox";
import { addDateFN } from "../../../../helpers/transformDate";

const AddProdInDay = ({ invoiceGuid }) => {
  const dispatch = useDispatch();

  const guidStandartAgent = "88F8CF21-F5D0-4F55-BC33-B168D739D1D4";

  const [search, setSearch] = useState("");

  const { listWorkshop } = useSelector((state) => state.mainSlice);
  const { listCategs } = useSelector((state) => state.mainSlice);
  const { listProds } = useSelector((state) => state.mainSlice);

  const { activeWorkShop } = useSelector((state) => state.selectsSlice);
  const { activeCategs } = useSelector((state) => state.selectsSlice);
  const { checkInvoice } = useSelector((state) => state.mainSlice);
  const { listTA, activeDate } = useSelector((state) => state.mainSlice);
  const { invoiceInfo } = useSelector((state) => state.mainSlice);

  const workShop = transformLists(listWorkshop, "guid", "name");
  const categs = transformLists(listCategs, "category_guid", "category_name");

  const onChangeWS = (item) => {
    dispatch(setActiveWorkShop(item)); ///// выбор селекта цехов
    dispatch(getListCategs(item)); /// для получение категорий
    setSearch("");
  };

  const onChangeCateg = (item) => {
    dispatch(setActiveCategs(item)); ///// выбор селекта категорий
    const obj = { guid: activeWorkShop?.guid, guidCateg: item?.category_guid };
    dispatch(getListProds(obj));
    /// для получение списка товаров
    setSearch("");
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
    if (value?.length === 0) {
      dispatch(getListWorkShop());
    } else {
      handleSearch(value);
    }
  };

  const addProdInvoice = async (obj) => {
    const { product_guid, count, workshop_price } = obj;
    if (!!!invoiceGuid) {
      myAlert("Выберите торгового агента!", "error");
      return;
    }

    if (obj?.count == "" || obj?.count == 0) {
      myAlert("Введите количество товара", "error");
      return;
    }

    const data = {
      invoice_guid: invoiceGuid,
      comment: "",
      products: [{ product_guid, count, workshop_price }],
    }; //// для добавление товара по олному в заявку

    const res = await dispatch(addEveryProd({ data })).unwrap();
    //// добавление товаров в заявку по одному(внутр есть хапрос на обновление)

    if (res?.result) {
      dispatch(getDefaultList()); //// очищаю counts всего списка

      //// для обновлнния накладной заявки
      const agents_guid = searchActiveOrdersTA(listTA);
      const send = {
        agents_guid: [...agents_guid, guidStandartAgent],
        date_from: invoiceInfo?.date_from,
        date_to: invoiceInfo?.date_from,
        //// для отпраки данных на обнолвение (после успешного добаление вызывается другой запрос)
      };
      dispatch(getEveryDataDay(send)); //// get данные всего дня
    }
  };

  const onChangeCount = (e, item) => {
    const count = e?.target?.value?.replace(",", ".");

    if (validNums(count)) {
      return; //// валидцаия на числа
    }

    dispatch(changeCountListProds({ ...item, count }));
    /////изменение ключа count в списке товаров
  };

  return (
    <div className="addProdInDay indridients">
      <div className="selectsAll__inner daySelects">
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
          <h6>Поиск товаров </h6>
          <input
            type="text"
            className="input"
            onChange={onChangeSearch}
            value={search}
          />
        </div>
      </div>
      <TableContainer
        component={Paper}
        sx={{ height: "100%" }}
        className="scroll_table standartTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "60%" }}>Продукт</TableCell>
              <TableCell align="left" style={{ width: "20%" }}>
                Цена
              </TableCell>
              <TableCell align="left" style={{ width: "20%" }}>
                Кол-во (кг)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listProds?.map((row) => (
              <TableRow key={row?.product_guid}>
                <TableCell component="th" scope="row" style={{ width: "60%" }}>
                  {row?.product_name}
                </TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  {row?.workshop_price} сом
                </TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  <div className="input">
                    <input
                      type="text"
                      onChange={(e) => onChangeCount(e, row)}
                      name="counts"
                      value={row?.count}
                      maxLength={10}
                      className="counts"
                      readOnly={!checkInvoice}
                    />
                    <button
                      onClick={() => addProdInvoice(row)}
                      disabled={!checkInvoice}
                    >
                      <AddBoxIcon sx={{ color: "#299b31" }} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddProdInDay;
