////// hooks
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import Select from "react-select";

////// style
import "./style.scss";

////// fns
import {
  createSpending,
  getListSpendingTA,
} from "../../../store/reducers/taskExpensesSlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { objStatusSpending } from "../../../helpers/objs";

/////// icons
import { transformLists } from "../../../helpers/transformLists";

const AddSpending = (props) => {
  const dispatch = useDispatch();

  const { setObj, obj, closeModal, active, dateRange } = props;

  const { listSpending } = useSelector((state) => state.taskExpensesSlice);

  const listNewSpending = transformLists(listSpending, "guid", "name");

  const onChangeSel = (spending) => setObj({ ...obj, spending });

  const onChange = (e) => setObj({ ...obj, [e.target.name]: e.target.value });

  const addEditSpendingFN = async () => {
    if (!obj?.spending?.value) return myAlert("Выберите трату", "error");
    if (!obj?.amount) return myAlert("Введите сумму", "error");
    if (!obj?.comment) return myAlert("Введите комментарий", "error");

    const send = { ...obj, active };
    const response = await dispatch(createSpending(send)).unwrap();
    if (response?.result == 1) {
      myAlert(response?.msg);
      dispatch(getListSpendingTA({ dateRange, active })); /// get список возможных трат TA
      closeModal();
    }
  };

  return (
    <div className="addTasks addSpending">
      <Modals
        openModal={!!obj?.type}
        closeModal={closeModal}
        title={objStatusSpending?.[obj?.type]}
      >
        <div className="addTasks__inner">
          <div className="myInputs">
            <h6>Выберите трату</h6>
            <Select
              options={listNewSpending}
              className="select"
              onChange={onChangeSel}
              value={obj?.spending}
            />
          </div>

          <SendInput
            value={obj?.amount}
            onChange={onChange}
            title={"Сумма (сом)"}
            name={"amount"}
            type={"number"}
          />

          <SendInput
            value={obj?.comment}
            onChange={onChange}
            title={"Комментарий"}
            name={"comment"}
            typeInput={"textarea"}
          />

          <div className="sendBlock">
            <button onClick={addEditSpendingFN}>+ Добавить</button>
          </div>
        </div>
      </Modals>
    </div>
  );
};

export default AddSpending;
