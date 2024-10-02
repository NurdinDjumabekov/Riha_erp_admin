/////// hooks
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

////// fns
import { clearDataSave } from "../../store/reducers/saveDataSlice";

////// components
import GraphicsEveryTA from "../../components/MainPage/Modals/GraphicsEveryTA/GraphicsEveryTA";

////// style
import "./style.scss";
import { useEffect } from "react";
import {
  getWorkPlanEveryTA,
  setListWorkPlan,
} from "../../store/reducers/mainSlice";

////// icons
import UserIcon from "@mui/icons-material/AccountCircle";
import {
  clearDataPay,
  getEveryDebt,
  sendPayFN,
  setDataPay,
} from "../../store/reducers/paySlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import SendInput from "../../common/SendInput/SendInput";
import Modals from "../../components/Modals/Modals";

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { guid, fio } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { debtEveryTA, dataPay } = useSelector((state) => state.paySlice);

  const clear = () => {
    dispatch(clearDataSave());
    navigate("/");
    window.location.reload();
  };

  const sendPay = () => {
    const data = {
      ...dataPay,
      user_type: "1",
      create_user_guid: "B85094A9-D70A-46AB-A724-5F3D7A506B37",
      create_user_type: "2",
    };
    dispatch(sendPayFN(data));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(setDataPay({ ...dataPay, [name]: value }));
  };

  const openModal = () => dispatch(setDataPay({ ...dataPay, user_guid: guid }));

  useEffect(() => {
    dispatch(getWorkPlanEveryTA({ guid }));
    dispatch(getEveryDebt({ agent_guid: guid }));
    dispatch(
      setListWorkPlan([
        { name: "Осталось выполнить", value: 95 },
        { name: "Выполнено", value: 5 },
      ])
    ); //// check
  }, []);

  const length = debtEveryTA?.vozvrat?.length == 0;

  return (
    <>
      <div className="settingsPage">
        <div className="plan__header">
          <div className="userInfo">
            <UserIcon sx={{ color: "#2c3e50" }} />
            <h1>{fio}</h1>
          </div>
          <button className="logoutParent" onClick={clear}>
            <div className="logoutInner">
              <div className="lineLogOut">
                <div className="lineLogOut__inner"></div>
              </div>
            </div>
          </button>
        </div>
        <div className="payCredit">
          <button onClick={openModal}>
            <PaymentsIcon />
            Произвести оплату
          </button>
          <h6>История оплат</h6>
          {length ? (
            <div className="emptyDataInner">
              <p>Список пустой</p>
            </div>
          ) : (
            <div className="payCredit__list">
              {debtEveryTA?.vozvrat?.map((item) => (
                <div>
                  <div className="mainData">
                    <p>{item?.date}</p>
                    <span>{item?.comment || "..."}</span>
                  </div>
                  <div className="status">
                    <p>Успешно</p>
                    <p>{item?.amount} сом</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <GraphicsEveryTA /> */}
      </div>

      <Modals
        openModal={!!dataPay?.user_guid}
        closeModal={() => dispatch(clearDataPay())}
        title={"Оплата"}
      >
        <div className="createPay">
          <SendInput
            value={dataPay?.amount}
            onChange={onChange}
            title={"Сумма"}
            name={"amount"}
            type="number"
          />

          <SendInput
            value={dataPay?.comment}
            onChange={onChange}
            title={"Ваш комментарий"}
            name={"comment"}
            type="text"
          />

          <button className="sendData" onClick={sendPay}>
            Произвести оплату
          </button>
        </div>
      </Modals>
    </>
  );
};

export default SettingsPage;
