////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import ListSearchTA from "../../common/ListSearchTA/ListSearchTA";
import PrihodPay from "../../components/PayPage/PrihodPay/PrihodPay";

////// style
import "./style.scss";

////// icons

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getEveryDebtReq, setDebtEveryTA } from "../../store/reducers/paySlice";

////// helpers

const PayPage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  function clickAgent(agent_guid) {
    setActive(agent_guid);
    dispatch(getEveryDebtReq({ agent_guid })); //  get список долгов каждого ТА
  }

  async function getData() {
    const list = await dispatch(getListTA({ first: false })).unwrap();
    setActive(list?.[0]?.guid);
    dispatch(getEveryDebtReq({ agent_guid: list?.[0]?.guid }));
  }

  useEffect(() => {
    getData();
    return () => dispatch(setDebtEveryTA({ vozvrat: [], dolg: [] }));
  }, []);

  return (
    <div className="payPage">
      <div className="payPage__header">sadadas</div>
      <div className="payPage__main">
        <>
          <ListSearchTA
            active={active}
            setActive={setActive}
            clickAgent={clickAgent}
          />
          <PrihodPay active={active} />
        </>
      </div>
    </div>
  );
};

export default PayPage;
