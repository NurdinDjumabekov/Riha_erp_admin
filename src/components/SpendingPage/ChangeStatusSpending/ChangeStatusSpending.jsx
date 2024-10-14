////// hooks
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import Select from "react-select";

////// style
import "./style.scss";

////// fns
import { getListSpendingTA } from "../../../store/reducers/taskExpensesSlice";
import { changeSpendingStatus } from "../../../store/reducers/taskExpensesSlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { listStatusSpending } from "../../../helpers/objs";

/////// icons

const ChangeStatusSpending = (props) => {
  const dispatch = useDispatch();

  const { setStatusAction, statusAction, closeModal, active, dateRange } =
    props;

  const onChangeSel = (status) => setStatusAction({ ...statusAction, status });

  const onChange = (e) => {
    setStatusAction({ ...statusAction, [e.target.name]: e.target.value });
  };

  const addEditSpendingFN = async () => {
    const res = await dispatch(changeSpendingStatus(statusAction)).unwrap();

    if (res?.result == 1) {
      myAlert(res?.msg);
      dispatch(getListSpendingTA({ dateRange, active })); /// get список возможных трат TA
      closeModal();
    }
  };

  return (
    <div className="addTasks addSpending">
      <Modals
        openModal={!!statusAction?.expense_guid}
        closeModal={closeModal}
        title={"Изменение статуса"}
      >
        <div className="addTasks__inner">
          <div className="myInputs">
            <h6>Выберите трату</h6>
            <Select
              options={listStatusSpending}
              className="select"
              onChange={onChangeSel}
              value={statusAction?.status}
            />
          </div>

          <SendInput
            value={statusAction?.comment}
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

export default ChangeStatusSpending;
