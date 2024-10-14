////// hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// icons
import user from "../../assets/images/iAm.jpg";
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getListSpendingTA } from "../../store/reducers/taskExpensesSlice";
import { getListSpending } from "../../store/reducers/taskExpensesSlice";

////// components
import { Tooltip } from "@mui/material";
import TableSpendings from "../../components/SpendingPage/TableSpendings/TableSpendings";
import DatePicker from "react-datepicker";

////// helpers
import { styleTooltip } from "../../helpers/LocalData";

////// style
import "./style.scss";

const SpendingPage = () => {
  const dispatch = useDispatch();

  const { listTA } = useSelector((state) => state.mainSlice);

  const [active, setActive] = useState(""); //// активный ТА
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const clickAgent = async (agent_guid) => {
    setActive(agent_guid); //// активный ТА
    dispatch(getListSpendingTA({ dateRange, active: agent_guid }));
    /// get список возможных трат TA
  };

  const onChangeDate = async (item) => {
    setDateRange(item);

    if (!!item?.[1]) {
      ///// сортировка трат по дате
      dispatch(getListSpendingTA({ dateRange: item, active }));
    }
  };

  const getData = async () => {
    try {
      const list = await dispatch(getListTA({ first: false })).unwrap();
      setActive(list?.[0]?.guid);
      dispatch(getListSpendingTA({ dateRange, active: list?.[0]?.guid }));
      /// get список возможных трат TA
    } catch (error) {}
  };

  useEffect(() => {
    getData();
    dispatch(getListSpending()); // get список возможных трат
  }, []);

  return (
    <div className="returnProds">
      <div className="returnProds__main">
        <div className="listTAInfo">
          <div className="date inputSend">
            <p>Сортировка по дате</p>
            <DatePicker
              selectsRange={true}
              startDate={dateRange?.[0]}
              endDate={dateRange?.[1]}
              onChange={onChangeDate}
              isClearable={true}
              maxDate={new Date()}
            />
            <EventIcon />
          </div>
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
                  <span>{i?.phone || "0700754454"} </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <TableSpendings active={active} dateRange={dateRange} />
      </div>
    </div>
  );
};

export default SpendingPage;
