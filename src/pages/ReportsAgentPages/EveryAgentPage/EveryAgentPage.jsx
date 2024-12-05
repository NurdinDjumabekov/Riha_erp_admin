////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

////// components
import ReactDatePicker from "react-datepicker";
import ReportRealization from "../../../components/ReportsAgentPages/ReportRealization/ReportRealization";
import GraphicsProds from "../../../components/ReportsAgentPages/GraphicsProds/GraphicsProds";
import GeneratePdfReportEveryAgent from "../../../components/Pdfs/GeneratePdfReportEveryAgent/GeneratePdfReportEveryAgent";

////// fns
import { getSaleAgentReq } from "../../../store/reducers/reportsSlice";

////// icons
import EventIcon from "@mui/icons-material/EventNoteTwoTone";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PriceCheckIcon from "@mui/icons-material/AttachMoney";

///// helpers
import { ru } from "date-fns/locale";

const EveryAgentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [dateTime, setDateTime] = useState(new Date());
  const [active, setActive] = useState(1);

  const { listSales } = useSelector((state) => state.reportsSlice);

  const onChangeDate = async (date) => {
    setDateTime(date);
    const send = { agent_guid: state?.guid, date };
    dispatch(getSaleAgentReq(send));
    ///// сортировка заявок по дате
  };

  useEffect(() => {
    const send = { agent_guid: state?.guid, date: dateTime };
    dispatch(getSaleAgentReq(send));
  }, []);

  const listActions = [
    { codeid: 1, icon: <PlaylistAddIcon />, name: "Реализация" },
    { codeid: 2, icon: <PlaylistRemoveIcon />, name: "Возврат" },
    { codeid: 3, icon: <PriceCheckIcon />, name: "Точки и оплаты" },
  ];

  const objComp = {
    1: (
      <>
        <div className="listProds">
          <ReportRealization
            list={listSales?.pickUp}
            title={"Список отпущенных товаров"}
          />
          <ReportRealization
            list={listSales?.sell}
            title={`Реализация агента "${state?.fio}"`}
          />
        </div>
        <div className="graphisc">
          <GraphicsProds list={listSales?.sell} />
        </div>
      </>
    ),
    2: (
      <>
        <div className="listProds listReturnProds">
          <ReportRealization
            list={listSales?.sell || []}
            title={`Возврат точек агенту "${state?.fio}"`}
          />
        </div>
        <div className="graphisc">
          <GraphicsProds list={listSales?.sell || []} />
        </div>
      </>
    ),
    3: "",
  };

  return (
    <div className="everyAgentPage">
      <div className="header">
        <div className="sortDateTime">
          <div className="date inputSend">
            <ReactDatePicker
              selected={dateTime}
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
          <GeneratePdfReportEveryAgent
            list={listSales?.sell}
            dateTime={dateTime}
          />
        </div>
      </div>
      <div className="body">
        <div className="reportVisit">
          <div className="times">
            <div>
              <p>Время начала работы агента:</p>
              <span>{listSales?.sell?.[0]?.start_time || "-"}</span>
            </div>
            <div>
              <p>Время окончания работы агента:</p>
              <span>{listSales?.sell?.[0]?.end_time || "-"}</span>
            </div>
          </div>
          <div className="actions">
            {listActions?.map((item) => (
              <button
                onClick={() => setActive(item?.codeid)}
                className={active == item?.codeid ? "active" : ""}
              >
                {item?.icon}
                <p>{item?.name}</p>
              </button>
            ))}
          </div>
        </div>
        {objComp?.[active]}
      </div>
    </div>
  );
};

export default EveryAgentPage;
