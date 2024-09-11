////// hooks
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListAcceptProd from "../ListAcceptProd/ListAcceptProd";

////// style
import "./style.scss";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { chechEmptyCount } from "../../../helpers/validations";

////// fns
import { editInvoice } from "../../../store/reducers/requestSlice";
import { createEditProdInInvoice } from "../../../store/reducers/requestSlice";
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
  const { invoiceInfo } = useSelector((state) => state.requestSlice);

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
    const obj = { forGetInvoice, forCreate, invoiceInfo };
    dispatch(createEditProdInInvoice(obj));
    ///// добавление и редактирование товаров в заявке
  };

  const delIInvoice = () => {
    const agents_guid = searchActiveOrdersTA(listTA);
    const data = { invoice_guid: invoiceInfo?.guid, status: -1 }; /// удаление -1 заявки
    const time = { date_from: "2024-09-09 18:00", date_to: "2024-09-09 21:30" };
    const send = { data: { ...data, ...time }, activeDate, agents_guid };
    dispatch(editInvoice(send));
  };

  return (
    <div className="listInvoice">
      <div className="acceptActions">
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
            {objActionInvoice?.[invoiceInfo?.action]?.img}
            <p>{objActionInvoice?.[invoiceInfo?.action]?.text}</p>
          </button>
        </div>
      </div>
      <ListAcceptProd list={listSendOrders} footer={true} />
    </div>
  );
};

export default ListAcceptInvoice;
