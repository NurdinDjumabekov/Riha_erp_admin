import { ru } from "date-fns/locale";

////// hooks
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import DatePicker from "react-datepicker";
import { useDropzone } from "react-dropzone";

////// style
import "./style.scss";

////// fns
import { getTasks } from "../../../store/reducers/taskExpensesSlice";
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

const AddSpending = (props) => {
  const dispatch = useDispatch();

  const { activeTA, activeTT } = props;
  const { dateRange, setObj, obj, closeModal } = props;

  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const onChangeDate = (dateTime) => {};

  const onChange = (e) => setObj({ ...obj, comment: e.target.value });

  const addEditTasksFN = async () => {
    if (!activeTT) return myAlert("Не выбрана торговая точка", "error");
    if (!obj?.comment) return myAlert("Добавьте комментарий", "error");
  };

  return (
    <div className="addTasks">
      <Modals
        openModal={!!obj?.type}
        closeModal={closeModal}
        title={objStatusTasks?.[obj?.type]}
      >
        <div className="addTasks__inner">
          <SendInput
            value={obj?.comment}
            onChange={onChange}
            title={"Комментарий"}
            name={"comment"}
            typeInput={"textarea"}
          />

          <div className="sendBlock">
            <button onClick={addEditTasksFN}>+ Добавить</button>
          </div>
        </div>
      </Modals>
    </div>
  );
};

export default AddSpending;
