////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

////// components
import ReportRealization from "../../../components/ReportsAgentPages/ReportRealization/ReportRealization";
import GraphicsProds from "../../../components/ReportsAgentPages/GraphicsProds/GraphicsProds";
import GeneratePdfReportEveryAgent from "../../../components/Pdfs/GeneratePdfReportEveryAgent/GeneratePdfReportEveryAgent";
import ReportPay from "../../../components/ReportsAgentPages/ReportPay/ReportPay";
import GeneratePdfReportPay from "../../../components/Pdfs/GeneratePdfReportPay/GeneratePdfReportPay";
import ReportSummaryWeek from "../../../components/ReportsAgentPages/ReportSummaryWeek/ReportSummaryWeek";
import SortCalendare from "../SortCalendare/SortCalendare";

////// fns
import {
  getReportPayReq,
  getSaleAgentReq,
} from "../../../store/reducers/reportsSlice";

////// icons
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PriceCheckIcon from "@mui/icons-material/AttachMoney";
import SummarizeIcon from "@mui/icons-material/Summarize";

///// helpers

const EveryAgentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [dateTime, setDateTime] = useState(new Date());
  const [active, setActive] = useState(1);

  const { listSales, reportPays } = useSelector((state) => state.reportsSlice);

  const listActions = [
    { codeid: 1, icon: <PlaylistAddIcon />, name: "Реализация" },
    { codeid: 2, icon: <PlaylistRemoveIcon />, name: "Возврат" },
    { codeid: 3, icon: <PriceCheckIcon />, name: "Точки и оплаты" },
    { codeid: 4, icon: <SummarizeIcon />, name: "Сводные отчёты" },
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
            list={listSales?.return || []}
            title={`Возврат точек агенту "${state?.fio}"`}
          />
        </div>
        <div className="graphisc">
          <GraphicsProds list={listSales?.return || []} />
        </div>
      </>
    ),
    3: <ReportPay />,
    4: <ReportSummaryWeek />,
  };

  const objPdf = {
    1: (
      <GeneratePdfReportEveryAgent
        list={listSales?.sell}
        dateTime={dateTime}
        title={"продаж"}
      />
    ),
    2: (
      <GeneratePdfReportEveryAgent
        list={listSales?.return}
        dateTime={dateTime}
        title={"возврата"}
      />
    ),
    3: (
      <GeneratePdfReportPay
        list={reportPays?.list_point}
        dateTime={dateTime}
        title={"долгов точек"}
      />
    ),
  };

  const listInfo = [
    {
      name: "Время начала работы агента: ",
      more: listSales?.sell?.[0]?.start_time || "-",
    },
    {
      name: "Время окончания работы агента: ",
      more: listSales?.sell?.[0]?.end_time || "-",
    },
    // {
    //   name: "Баланс агента: ",
    //   more: roundingNum(reportPays?.money_agent) || "временно недоступно",
    // },
  ];

  return (
    <div className="everyAgentPage">
      <div className="header">
        <div className="sortDateTime">
          <SortCalendare
            setDateTime={setDateTime}
            dateTime={dateTime}
            active={active}
          />
          {objPdf?.[active]}
        </div>
      </div>
      <div className="body">
        <div className="reportVisit">
          <div className="times">
            {listInfo?.map((i) => (
              <div>
                <p>{i?.name}</p>
                <span>{i?.more}</span>
              </div>
            ))}
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
