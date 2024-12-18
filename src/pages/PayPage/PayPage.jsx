////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListSearchTA from "../../common/ListSearchTA/ListSearchTA";

////// style
import "./style.scss";

////// icons
import arrow from "../../assets/icons/arrowMenu.svg";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getEveryDebtReq, setDebtEveryTA } from "../../store/reducers/paySlice";
import PrihodPay from "../../components/PayPage/PrihodPay/PrihodPay";

////// helpers

const PayPage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  const clickAgent = (agent_guid) => {
    setActive(agent_guid);
    dispatch(getEveryDebtReq({ agent_guid })); //  get список долгов каждого ТА
  };

  const getData = async () => {
    const list = await dispatch(getListTA({ first: false })).unwrap();
    setActive(list?.[0]?.guid);
    dispatch(getEveryDebtReq({ agent_guid: list?.[0]?.guid }));
  };

  useEffect(() => {
    getData();
    return () => dispatch(setDebtEveryTA({ vozvrat: [], dolg: [] }));
  }, []);

  // console.log(debtEveryTA, "debtEveryTA");

  return (
    <div className="payPage">
      <div className="payPage__main">
        <ListSearchTA
          active={active}
          setActive={setActive}
          clickAgent={clickAgent}
        />
        <PrihodPay active={active} />
      </div>
    </div>
  );
};

export default PayPage;
