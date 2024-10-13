import { ru } from "date-fns/locale";

////// hooks
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";

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

/////// icons
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";

const AddTasks = (props) => {
  const { activeTA, activeTT } = props;
  const { dateRange, setObj, obj, closeModal } = props;
  const dispatch = useDispatch();

  const onChangeDate = (dateTime) => {
    setObj({ ...obj, deadline_date: dateTime });
  };

  const onChange = (e) => setObj({ ...obj, comment: e.target.value });

  const onDrop = useCallback(
    (acceptedFiles) => {
      setObj({ ...obj, filesUser: [...obj.filesUser, ...acceptedFiles] });
    },
    [obj, setObj]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (fileToRemove) => {
    const filesUser = obj?.filesUser?.filter((file) => file !== fileToRemove);
    setObj({ ...obj, filesUser });
  };

  const addEditTasksFN = async () => {
    if (!activeTT) return myAlert("Не выбрана торговая точка", "error");
    if (!obj?.comment) return myAlert("Добавьте комментарий", "error");

    const data = {
      ...obj,
      point_guid: activeTT,
      agent_guid: activeTA,
      deadline_date: transformDateTime(obj?.deadline_date),
    };

    const response =
      obj?.type === 1
        ? await dispatch(createTasks(data)).unwrap()
        : await dispatch(editTasks(data)).unwrap();

    if (response?.result == 1) {
      const sendData = {
        agent_guid: activeTA,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[0]),
        point_guid: activeTT,
      };
      dispatch(getTasks(sendData));
      myAlert(response?.msg);
      closeModal();
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
        openModal={!!obj?.type}
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

          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Перетащите сюда файлы или кликните для выбора</p>
          </div>

          <ul>
            {obj?.filesUser?.map((file, index) => (
              <li key={index}>
                <p>{file?.name}</p>
                <button onClick={() => removeFile(file)}>
                  <DeleteIcon width={19} height={19} color={"red"} />
                </button>
              </li>
            ))}
          </ul>

          <div className="sendBlock">{objAction?.[obj?.type]}</div>
        </div>
      </Modals>
    </div>
  );
};

export default AddTasks;
