////// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import SendInput from "../../../common/SendInput/SendInput";
import Modals from "../../../components/Modals/Modals";
import Select from "react-select";

///// helpers
import { transformLists } from "../../../helpers/transformLists";

////// fns
import {
  clearCrudRoute,
  ListRouteCRUD,
  setCrudRoute,
} from "../../../store/reducers/mapSlice";

////// style
import "./style.scss";
import { myAlert } from "../../../helpers/MyAlert";

const ActionsListRoute = () => {
  const dispatch = useDispatch();

  const { listTA } = useSelector((state) => state.mainSlice);
  const { crudRoute } = useSelector((state) => state.mapSlice);
  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { activeTA } = useSelector((state) => state.selectsSlice);

  ////// create
  const onChange = (e, type) => {
    if (!!type) {
      dispatch(setCrudRoute({ ...crudRoute, agent_select: e }));
    } else {
      const obj = { ...crudRoute, [e.target.name]: e.target.value };
      dispatch(setCrudRoute(obj));
    }
  };

  const createRouteFN = () => {
    if (!!!crudRoute?.agent_select?.value) {
      myAlert("Выберите торгового агента!", "error");
      return;
    }
    if (!!!crudRoute?.number) {
      myAlert("Задайте номер маршруту!", "error");
      return;
    }

    const data = {
      ...crudRoute,
      ...dataSave,
      agent_guid: crudRoute?.agent_select?.value,
      activeTA,
    };
    if (crudRoute?.actionType == 1) {
      //// создание
      dispatch(ListRouteCRUD(data));
    } else if (crudRoute?.actionType == 2) {
      //// редактирование
      dispatch(ListRouteCRUD({ ...data, route_sheet_guid: crudRoute?.guid }));
    }
  };

  const list_TA = transformLists(listTA, "guid", "fio");

  const closeModal = () => dispatch(clearCrudRoute());

  const objAction = { 1: "+ Добавить", 2: "Редактировать", 3: "Удалить" };
  const objTitle = { 1: "Добавить маршрут", 2: "Редактировать", 3: "Удалить" };

  return (
    <>
      <Modals
        openModal={!!crudRoute?.actionType}
        closeModal={closeModal}
        title={objTitle?.[crudRoute?.actionType]}
      >
        <div className="createRoute">
          <div className="inputSend">
            <p>Торговый агент</p>
            <Select
              options={list_TA}
              className="select"
              onChange={(item) => onChange(item, "sel")}
              value={crudRoute?.agent_select}
            />
          </div>

          <SendInput
            value={crudRoute?.number}
            onChange={onChange}
            title={"Номер маршрута"}
            name={"number"}
            type="number"
          />

          <SendInput
            value={crudRoute?.comment}
            onChange={onChange}
            title={"Комментарий"}
            name={"comment"}
          />

          <div className="sendBlock">
            <button className="sendData" onClick={createRouteFN}>
              {objAction?.[crudRoute?.actionType]}
            </button>
          </div>
        </div>
      </Modals>
    </>
  );
};

export default ActionsListRoute;
