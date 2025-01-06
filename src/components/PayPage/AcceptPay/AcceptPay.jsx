////// hooks
import { useDispatch, useSelector } from "react-redux";

////// components
import Modals from "../../../common/Modals/Modals";
import SendInput from "../../../common/SendInput/SendInput";
import ReactSelect from "react-select";

////// style
import "./style.scss";

////// fns
import { getEveryDebtReq, payTA } from "../../../store/reducers/paySlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { listStatusPay } from "../../../helpers/LocalData";

const AcceptPay = (props) => {
  const dispatch = useDispatch();

  const { setObj, obj, closeModal, active, listItem } = props;

  const onChange = (e) => setObj({ ...obj, [e.target.name]: e.target.value });

  const onChangeSelect = (item) => {
    setObj({ ...obj, status: item });
  };

  const addEditSpendingFN = async () => {
    if (!!!obj?.amount) return myAlert("Введите сумму", "error");
    if (!!!obj?.comment) return myAlert("Введите описание", "error");

    const send = { ...obj, status: obj?.status?.value };
    const response = await dispatch(payTA(send)).unwrap();
    if (response?.result == 1) {
      myAlert(response?.msg);
      dispatch(getEveryDebtReq({ agent_guid: active })); // get список долгов каждого ТА
      closeModal();
    }
  };

  return (
    <div className="addTasks addSpending">
      <Modals
        openModal={!!obj?.user_guid}
        closeModal={closeModal}
        title={`${listItem?.fio}`}
      >
        <div className="addTasks__inner">
          <SendInput
            value={obj?.amount}
            onChange={onChange}
            title={"Сумма (сом)"}
            name={"amount"}
            type={"number"}
          />

          <div className="myInputs selectPosition">
            <h6>Статус оплаты</h6>
            <ReactSelect
              options={listStatusPay}
              className="select"
              onChange={onChangeSelect}
              value={obj?.status}
            />
          </div>

          <SendInput
            value={obj?.comment}
            onChange={onChange}
            title={"Описание"}
            name={"comment"}
            typeInput={"textarea"}
          />

          <div className="sendBlock">
            <button onClick={addEditSpendingFN}>Сохранить</button>
          </div>
        </div>
      </Modals>
    </div>
  );
};

export default AcceptPay;
