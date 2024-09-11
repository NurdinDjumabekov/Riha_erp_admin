////// hooks
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListAcceptProd from "../ListAcceptProd/ListAcceptProd";

////// helpers
import { searchActiveOrdersTA } from "../../../helpers/searchActiveOrdersTA";
import { checkEditInputs } from "../../../helpers/validations";

////// fns
import { editInvoice } from "../../../store/reducers/requestSlice";
import { createEditProdInInvoice } from "../../../store/reducers/requestSlice";

////// icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

////// style
import "./style.scss";
import { transformListsProdsEdit } from "../../../helpers/transformLists";

const ListAcceptInvoice = () => {
  const dispatch = useDispatch();

  const [delInvoice, setDelInvoice] = useState(false);

  const { listTA, checkInvoice } = useSelector((state) => state.requestSlice);
  const { guid } = useSelector((state) => state.requestSlice?.invoiceInfo);
  const { listSendOrders } = useSelector((state) => state.requestSlice);
  const { activeDate } = useSelector((state) => state.requestSlice);

  const delIInvoice = () => {
    const agents_guid = searchActiveOrdersTA(listTA);
    const data = { invoice_guid: guid, status: -1 }; /// удаление -1 заявки
    const time = { date_from: "2024-09-09 18:00", date_to: "2024-09-09 21:30" };
    const send = { data: { ...data, ...time }, activeDate, agents_guid };
    dispatch(editInvoice(send));
  };

  const check = checkEditInputs(listSendOrders); /// если уже были изменения то возвращaть true

  const editProdInInvoice = () => {
    /////  редактирование твоаров в заявке
    const forCreate = { listProds: listSendOrders, comment: "" };
    const forGetInvoice = { activeDate, listTA };
    const obj = { forGetInvoice, forCreate };
    const invoiceInfo = { guid, action: 2 }; //// редактирование товара (action: 2)
    dispatch(createEditProdInInvoice({ ...obj, invoiceInfo }));
    ///// добавление и редактирование товаров в заявке
  };

  return (
    <div className="listInvoice">
      <div className="acceptActions">
        <div className="acceptActions__inner">
          {checkInvoice ? (
            <button
              className="saveAction del"
              onClick={() => setDelInvoice(true)}
            >
              <DeleteOutlineIcon sx={{ width: 18, height: 18 }} />
              <p>Удалить запись</p>
            </button>
          ) : (
            <h4>Список принятых товаров</h4>
          )}
          <ConfirmModal
            state={delInvoice}
            yesFN={delIInvoice}
            noFN={() => setDelInvoice(false)}
            title={"Удалить заявку ?"}
          />
          {check && (
            <button className="saveAction" onClick={editProdInInvoice}>
              <LibraryAddIcon sx={{ width: 16, height: 16 }} />
              <p>Сохранить изменения</p>
            </button>
          )}
        </div>
      </div>
      <ListAcceptProd />
    </div>
  );
};

export default ListAcceptInvoice;
