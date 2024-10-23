import { ru } from "date-fns/locale";

////// hooks
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";

////// style
import "./style.scss";

////// fns
import { editTasks, getTasks } from "../../../store/reducers/taskExpensesSlice";
import { delFileInTasks } from "../../../store/reducers/taskExpensesSlice";
import { addFileInTasks } from "../../../store/reducers/taskExpensesSlice";
import { createTasks } from "../../../store/reducers/taskExpensesSlice";

////// helpers
import { transformDateTime } from "../../../helpers/transformDate";
import { transformActionDate } from "../../../helpers/transformDate";
import { myAlert } from "../../../helpers/MyAlert";
import { objStatusTasks } from "../../../helpers/objs";

/////// icons
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";

const AddTasks = (props) => {
  const dispatch = useDispatch();

  const { activeTA, activeTT } = props;
  const { dateRange, setObj, obj, closeModal } = props;

  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const onChangeDate = (dateTime) => {
    setObj({ ...obj, deadline_date: dateTime });
  };

  const onChange = (e) => setObj({ ...obj, comment: e.target.value });

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (obj?.type == 1) {
        setObj({ ...obj, filesUser: [...obj.filesUser, ...acceptedFiles] });
        //// загрузка файлов при создание задачи
      } else if (obj?.type == 2) {
        //// загрузка файлов при редактирование задачи
        const formData = new FormData();
        formData.append("user_guid", dataSave?.guid);
        formData.append("task_guid", obj?.guid);
        formData.append("user_type", dataSave?.user_type);
        formData.append("route_guid", "0");
        formData.append("user_guid", "0");
        formData.append("user_type", "0");
        acceptedFiles?.forEach((file) => {
          formData.append("files", file);
        });
        const loadFile = async () => {
          const resp = await dispatch(addFileInTasks(formData)).unwrap();
          setObj({ ...obj, filesUser: [...obj.filesUser, ...resp?.data] });
        };
        loadFile();
      }
    },
    [obj, setObj]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const addEditTasksFN = async () => {
    if (!activeTT) return myAlert("Не выбрана торговая точка", "error");
    if (!obj?.comment) return myAlert("Добавьте комментарий", "error");

    const { filesUser, filesAgent, ...others } = obj;
    const i = { ...others, point_guid: activeTT, agent_guid: activeTA };
    const deadline_date = transformDateTime(obj?.deadline_date);

    let response;
    if (obj?.type == 1) {
      //// создание задачи

      response = await dispatch(createTasks({ ...i, deadline_date })).unwrap();

      // if (response?.guid) {
      //   const formData = new FormData();
      //   formData.append("user_guid", dataSave?.guid);
      //   formData.append("task_guid", response?.guid);
      //   formData.append("user_type", dataSave?.user_type);
      //   formData.append("route_guid", "0");
      //   formData.append("user_guid", "0");
      //   formData.append("user_type", "0");
      //   obj?.filesUser?.forEach((file) => {
      //     formData.append("files", file);
      //   });

      //   const resFile = await dispatch(addFileInTasks(formData)).unwrap();

      //   /// resFile
      //   // if (resFile?.result == 1) {
      //   if (true) {
      //     const sendData = {
      //       agent_guid: activeTA,
      //       date_from: transformActionDate(dateRange?.[0]),
      //       date_to: transformActionDate(dateRange?.[0]),
      //       point_guid: activeTT,
      //     };
      //     dispatch(getTasks(sendData));
      //     closeModal();
      //   }
      // }
    } else if (obj?.type == 2) {
      //// редактирование задачи
      const i = { ...obj, point_guid: activeTT, agent_guid: activeTA };
      const deadline_date = transformDateTime(obj?.deadline_date);
      response = await dispatch(editTasks({ ...i, deadline_date })).unwrap();
    }

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

  const delFileLocal = (fileToRemove) => {
    const filesUser = obj?.filesUser?.filter((file) => file !== fileToRemove);
    setObj({ ...obj, filesUser });
  };

  const removeFiles = async ({ guid }) => {
    const response = await dispatch(delFileInTasks(guid)).unwrap();
    if (response.result == 1) {
      const filesUser = obj?.filesUser?.filter((item) => item?.guid !== guid);
      setObj({ ...obj, filesUser });
    }
  };

  const objAction = {
    1: <button onClick={addEditTasksFN}>+ Добавить</button>,
    2: <button onClick={addEditTasksFN}>+ Редактировать</button>,
  };

  const objLists = {
    1: (
      <ul>
        {obj?.filesUser?.map((file, index) => (
          <li key={index}>
            <p>{file?.name}</p>
            <button onClick={() => delFileLocal(file)}>
              {/* удаление файла локально */}
              <DeleteIcon width={19} height={19} color={"red"} />
            </button>
          </li>
        ))}
      </ul>
    ),
    2: (
      <ul>
        {obj?.filesUser?.map((file, index) => (
          <li key={index}>
            <p>{file?.name}</p>
            <button onClick={() => removeFiles(file)}>
              {/* удаление файла через запрос */}
              <DeleteIcon width={19} height={19} color={"red"} />
            </button>
          </li>
        ))}
      </ul>
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

          <div className="sendData">{objLists?.[obj?.type]}</div>

          <div className="sendBlock">{objAction?.[obj?.type]}</div>
        </div>
      </Modals>
    </div>
  );
};

export default AddTasks;
