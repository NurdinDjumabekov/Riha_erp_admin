import { ru } from "date-fns/locale";

////// hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// icons
import user from "../../assets/images/iAm.jpg";
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

////// fns
import { getHistoryInvoice, getListTA } from "../../store/reducers/mainSlice";
import { setActiveDateHistory } from "../../store/reducers/mainSlice";

////// components
import { Tooltip } from "@mui/material";
import InfoProds from "../../components/HistoryApplicationPage/InfoProds/InfoProds";
import DatePicker from "react-datepicker";

////// style
import "./style.scss";

////// helpers
import { styleTooltip } from "../../helpers/LocalData";
import { transformActionDate } from "../../helpers/transformDate";
import { reverseTransformActionDate } from "../../helpers/transformDate";

const HistoryApplicationPage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState("");

  const { listTA } = useSelector((state) => state.mainSlice);
  const { activeDateHistory } = useSelector((state) => state.mainSlice);

  const clickAgent = (agent_guid) => {
    setActive(agent_guid);
    const data = { date_from: activeDateHistory, date_to: activeDateHistory };
    const obj = { agents_guid: [agent_guid], history: 1 };
    dispatch(getHistoryInvoice({ ...data, ...obj })); // get список историй заявок
  };

  const onChangeDate = async (item) => {
    ///// сортировка заявок по дате
    dispatch(setActiveDateHistory(transformActionDate(item)));
    const data = {
      date_from: transformActionDate(item),
      date_to: transformActionDate(item),
    };
    const obj = { agents_guid: [active], history: 1 };
    dispatch(getHistoryInvoice({ ...data, ...obj })); // get список историй заявок
  };

  const getData = async () => {
    try {
      const list = await dispatch(getListTA({ first: false })).unwrap();
      setActive(list?.[0]?.guid);
      const data = { date_from: activeDateHistory, date_to: activeDateHistory };
      const obj = { agents_guid: [list?.[0]?.guid], history: 1 };
      dispatch(getHistoryInvoice({ ...data, ...obj })); // get список историй заявок
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="hitoryTA">
      <div className="hitoryTA__main">
        <div className="listTAInfo">
          <div className="date inputSend">
            <p>Дата создания заявки</p>
            <DatePicker
              selected={reverseTransformActionDate(activeDateHistory)}
              onChange={onChangeDate}
              yearDropdownItemNumber={100}
              placeholderText="ДД.ММ.ГГГГ"
              shouldCloseOnSelect={true}
              scrollableYearDropdown
              dateFormat="dd.MM.yyyy"
              locale={ru}
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
        <InfoProds />
      </div>
    </div>
  );
};

export default HistoryApplicationPage;
