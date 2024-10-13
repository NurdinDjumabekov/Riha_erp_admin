import { ru } from "date-fns/locale";

////// hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import DatePicker from "react-datepicker";

////// style
import "./style.scss";

////// fns
import { editTasks, getTasks } from "../../../store/reducers/taskExpensesSlice";
import { createTasks } from "../../../store/reducers/taskExpensesSlice";

////// helpers
import { transformDateTime } from "../../../helpers/transformDate";
import { transformActionDate } from "../../../helpers/transformDate";
import { myAlert } from "../../../helpers/MyAlert";
import { objStatusTasks } from "../../../helpers/objs";

const AddTasks = (props) => {
  const { activeTA, activeTT } = props;
  const { dateRange, setObj, obj, closeModal } = props;

  const dispatch = useDispatch();

  const onChangeDate = (dateTime) => {
    ///// назначение делайна для ТА
    setObj({ ...obj, deadline_date: dateTime });
  };

  const onChange = (e) => setObj({ ...obj, comment: e.target.value });

  const addEditTasksFN = async () => {
    /// 1 - создание задачи , 2 - редактирование задачи
    if (!!!activeTT) myAlert("Не выбрана торговая точка", "error");
    if (!!!obj?.comment) myAlert("Добавьте комментарий", "error");
    const data = {
      ...obj,
      point_guid: activeTT,
      agent_guid: activeTA,
      deadline_date: transformDateTime(obj?.deadline_date),
    };

    let response;
    if (obj?.type == 1) {
      response = await dispatch(createTasks(data)).unwrap();
    } else if (obj?.type == 2) {
      response = await dispatch(editTasks(data)).unwrap();
    }

    if (response?.result == 1) {
      const sendData = {
        agent_guid: activeTA,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[0]),
        point_guid: activeTT,
      };
      dispatch(getTasks(sendData)); ///  get список задач
      myAlert(response?.msg);
      closeModal(); /// сброс данных после успешного запроса
    }
  };

  const objAction = {
    1: (
      <button className="sendData" onClick={addEditTasksFN}>
        + Добавить
      </button>
    ),
    2: (
      <button className="sendData" onClick={addEditTasksFN}>
        + Редактировать
      </button>
    ),
  };

  return (
    <div className="addTasks">
      <Modals
        openModal={!!obj?.type} /// 1 - создание задачи , 2 - редавтирование задачи
        closeModal={closeModal}
        title={objStatusTasks?.[obj?.type]}
      >
        <div className="addTasks__inner">
          <div className="date">
            <p>Дата реализации (дедлайн)</p>
            <DatePicker
              selected={obj?.deadline_date}
              onChange={onChangeDate}
              yearDropdownItemNumber={100}
              placeholderText="ДД.ММ.ГГГГ"
              locale={ru}
              showTimeSelect
              timeFormat="p"
              timeIntervals={15}
              dateFormat="Pp"
              minDate={new Date()}
            />
          </div>

          <SendInput
            value={obj?.comment}
            onChange={onChange}
            title={"Комментарий"}
            name={"comment"}
            typeInput={"textarea"}
          />

          <div className="sendBlock">{objAction?.[obj?.type]}</div>
        </div>
      </Modals>
    </div>
  );
};

export default AddTasks;
