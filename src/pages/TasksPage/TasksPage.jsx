////// hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// icons
import user from "../../assets/images/iAm.jpg";
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import { getPointsRouteAgent } from "../../store/reducers/mapSlice";
import { getTasks } from "../../store/reducers/taskExpensesSlice";

////// components
import { Tooltip } from "@mui/material";
import DatePicker from "react-datepicker";
import TableTasks from "../../components/TasksPage/TableTasks/TableTasks";

////// helpers
import { styleTooltip } from "../../helpers/LocalData";
import { transformActionDate } from "../../helpers/transformDate";

////// style
import "./style.scss";

const TasksPage = () => {
  const pointImg = "https://static.baza.farpost.ru/v/1697612170155_bulletin";
  const dispatch = useDispatch();

  const { listTA } = useSelector((state) => state.mainSlice);
  const { listPointsEveryTA } = useSelector((state) => state.mapSlice);

  const [activeTA, setActiveTA] = useState(""); //// активный ТА
  const [activeTT, setActiveTT] = useState(""); //// активный ТТ
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const clickAgent = async (agent_guid) => {
    setActiveTA(agent_guid); //// активный ТА
    const obj = { guid: agent_guid, first: false };
    const listTT = await dispatch(getPointsRouteAgent(obj)).unwrap(); /// get список тт
    setActiveTT(listTT?.[0]?.guid); //// активный ТТ
    const sendData = {
      agent_guid: agent_guid,
      date_from: transformActionDate(dateRange?.[0]),
      date_to: transformActionDate(dateRange?.[0]),
      point_guid: listTT?.[0]?.guid,
    };
    dispatch(getTasks(sendData)); ///  get список задач
  };

  const clickPoint = async (guid) => {
    setActiveTT(guid); //// активный ТТ
    const sendData = {
      agent_guid: activeTA,
      date_from: transformActionDate(dateRange?.[0]),
      date_to: transformActionDate(dateRange?.[0]),
      point_guid: guid,
    };
    dispatch(getTasks(sendData)); ///  get список задач
  };

  const onChangeDate = async (item) => {
    setDateRange(item);

    if (!!item?.[1]) {
      /// сортировка тасков по дате
      const obj = { guid: activeTA, first: false };
      const listTT = await dispatch(getPointsRouteAgent(obj)).unwrap(); /// get список тт
      setActiveTT(listTT?.[0]?.guid); //// активный ТТ
      const sendData = {
        agent_guid: activeTA,
        date_from: transformActionDate(item?.[0]),
        date_to: transformActionDate(item?.[0]),
        point_guid: listTT?.[0]?.guid,
      };
      dispatch(getTasks(sendData)); ///  get список задач
    }
  };

  const getData = async () => {
    try {
      const list = await dispatch(getListTA({ first: false })).unwrap();
      setActiveTA(list?.[9]?.guid); //// активный ТА
      const obj = { guid: list?.[9]?.guid, first: false };
      const listTT = await dispatch(getPointsRouteAgent(obj)).unwrap();

      setActiveTT(listTT?.[0]?.guid); //// активный ТТ

      const sendData = {
        agent_guid: list?.[9]?.guid,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[0]),
        point_guid: listTT?.[0]?.guid,
      };
      dispatch(getTasks(sendData));
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="tasksPage">
      <div className="tasksPage__inner">
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
          <h6>Торговые агенты</h6>
          <div className="line"></div>
          <div className="listTAInfo__inner scroll_table">
            {listTA?.map((i) => (
              <button
                key={i?.guid}
                onClick={() => clickAgent(i?.guid)}
                className={activeTA == i?.guid ? "active" : ""}
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
        <div className="listTAInfo listTT">
          <h6>Торговые точки</h6>
          <div className="line"></div>
          <div className="listTAInfo__inner scroll_table">
            {listPointsEveryTA?.map((i) => (
              <button
                key={i?.guid}
                onClick={() => clickPoint(i?.guid)}
                className={activeTT == i?.guid ? "active" : ""}
              >
                <div className="logo">
                  <Tooltip
                    title={
                      <div style={{ borderRadius: "50%" }}>
                        <img
                          src={i?.sellers?.[0]?.photo || pointImg}
                          alt="user"
                          style={styleTooltip}
                        />
                      </div>
                    }
                    placement="right"
                    disableInteractive
                  >
                    <img src={i?.sellers?.[0]?.photo || pointImg} alt="" />
                  </Tooltip>
                </div>
                <div className="content">
                  <p>{i?.text}</p>
                  <span>{i?.sellers?.[0]?.seller_fio || "0700754454"} </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <TableTasks
          activeTA={activeTA}
          activeTT={activeTT}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default TasksPage;
