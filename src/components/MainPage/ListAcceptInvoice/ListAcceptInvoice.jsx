////// hooks
import * as React from "react";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListProdCRUD from "../ListProdCRUD/ListProdCRUD";
import debounce from "debounce";

////// style
import "./style.scss";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { chechEmptyCount } from "../../../helpers/validations";

////// fns
import {
  createEditProdInInvoice,
  editInvoice,
} from "../../../store/reducers/requestSlice";
import { objActionInvoice } from "../../../helpers/objs";

////// icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import { searchActiveOrdersTA } from "../../../helpers/searchActiveOrdersTA";

const ListAcceptInvoice = () => {
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const [delInvoice, setDelInvoice] = useState(false);

  const { listTA } = useSelector((state) => state.requestSlice);
  const { listSendOrders } = useSelector((state) => state.requestSlice);
  const { activeDate } = useSelector((state) => state.requestSlice);
  const { invoiceGuid } = useSelector((state) => state.requestSlice);
  const { listProds } = useSelector((state) => state.requestSlice);

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

  const guids = listSendOrders?.map((item) => item?.product_guid);

  // тут список только выбранныхз данных
  const listSort = listProds?.filter(({ product_guid }) =>
    guids?.includes(product_guid)
  );

  const delIInvoice = () => {
    const agents_guid = searchActiveOrdersTA(listTA);
    const data = { invoice_guid: invoiceGuid?.guid, status: -1 }; /// удаление -1 заявки
    const time = { date_from: "2024-09-09 18:00", date_to: "2024-09-09 21:30" };
    const send = { data: { ...data, ...time }, activeDate, agents_guid };
    dispatch(editInvoice(send));
  };

  return (
    <div className="listInvoice accepts">
      <div className="acceptActions">
        <h5>№ {listSendOrders?.[0]?.codeid}</h5>
        <div className="acceptActions__inner">
          <button
            className="saveAction del"
            onClick={() => setDelInvoice(true)}
          >
            <DeleteOutlineIcon sx={{ width: 18, height: 18 }} />
            <p>Удалить запись</p>
          </button>
          <ConfirmModal
            state={delInvoice}
            yesFN={delIInvoice}
            noFN={() => setDelInvoice(false)}
            title={"Удалить заявку ?"}
          />
          <button className="saveAction" onClick={actionsProdInInvoice}>
            {objActionInvoice?.[invoiceGuid?.action]?.img}
            <p>{objActionInvoice?.[invoiceGuid?.action]?.text}</p>
          </button>
        </div>
      </div>
      <ListProdCRUD list={listSort} footer={true} />
      {/* <div className="selectsAll">
        <div className="myInputs">
          <h6>Комментарий</h6>
          <input
            type="text"
            className="input"
            value={comment}
            onChange={onChangeComm}
          />
        </div>
      </div> */}
    </div>
  );
};

export default ListAcceptInvoice;
