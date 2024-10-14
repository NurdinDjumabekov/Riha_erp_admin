////// hooks
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";

////// style
import "./style.scss";

////// fns
import { getEveryDebt, payTA } from "../../../store/reducers/paySlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";

const AcceptPay = (props) => {
  const dispatch = useDispatch();

  const { setObj, obj, closeModal, active, listItem } = props;
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const onChange = (e) => setObj({ ...obj, [e.target.name]: e.target.value });

  const addEditSpendingFN = async () => {
    if (!obj?.amount) return myAlert("Введите сумму", "error");

    const send = {
      ...obj,
      user_guid: active,
      user_type: "1",
      create_user_guid: dataSave?.guid,
    };
    const response = await dispatch(payTA(send)).unwrap();
    if (response?.result == 1) {
      myAlert(response?.msg);
      dispatch(getEveryDebt({ agent_guid: active })); // get список долгов каждого ТА
      closeModal();
    }
  };

  return (
    <div className="addTasks addSpending">
      <Modals
        openModal={!!obj?.create_user_type}
        closeModal={closeModal}
        title={`Погашение долга у ${listItem?.fio}`}
      >
        <div className="addTasks__inner">
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

export default AcceptPay;
