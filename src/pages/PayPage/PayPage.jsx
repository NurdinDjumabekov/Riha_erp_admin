////// hooks
import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Tooltip } from "@mui/material";
import InfoDebit from "../../components/PayPage/InfoDebit/InfoDebit";

////// style
import "./style.scss";

////// icons
import user from "../../assets/images/iAm.jpg";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getEveryDebt, setDebtEveryTA } from "../../store/reducers/paySlice";

////// helpers
import { styleTooltip } from "../../helpers/LocalData";

const PayPage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  const { listTA } = useSelector((state) => state.mainSlice);
  const { debtEveryTA } = useSelector((state) => state.paySlice);

  const clickAgent = (agent_guid) => {
    setActive(agent_guid);
    dispatch(getEveryDebt({ agent_guid })); //  get список долгов каждого ТА
  };

  const getData = async () => {
    try {
      const list = await dispatch(getListTA({ first: false })).unwrap();
      setActive(list?.[0]?.guid);
      dispatch(getEveryDebt({ agent_guid: list?.[0]?.guid }));
    } catch (error) {}
  };

  useEffect(() => {
    getData();
    return () => dispatch(setDebtEveryTA({ vozvrat: [], dolg: [] }));
  }, []);

  return (
    <div className="payPage">
      <div className="payPage__main">
        <div className="listTAInfo">
          <h6>Торговые агенты</h6>
          <div className="line"></div>
          <div className="listTAInfo__inner scroll_table">
            {listTA?.map((i) => (
              <button
                key={i?.guid}
                onClick={() => clickAgent(i?.guid)}
                className={active == i?.guid ? "active" : ""}
              >
                <div className="logo">
                  <Tooltip
                    title={
                      <div style={{ borderRadius: "50%" }}>
                        <img src={user} alt="user" style={styleTooltip} />
                      </div>
                    }
                    placement="right"
                    disableInteractive
                  >
                    <img src={i?.photo || user} alt="" />
                  </Tooltip>
                </div>
                <div className="content">
                  <p>{i?.fio}</p>
                  <span>Баланс: {i?.balance} сом</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <InfoDebit debtEveryTA={debtEveryTA} active={active} />
      </div>
    </div>
  );
};

export default PayPage;
