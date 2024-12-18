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
import GeneratePdfSummaryReportPay from "../../../components/Pdfs/GeneratePdfSummaryReportPay/GeneratePdfSummaryReportPay";

////// fns

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
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { listSales, reportPays, reportSummary } = useSelector(
    (state) => state.reportsSlice
  );

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
    4: <GeneratePdfSummaryReportPay selectedDate={selectedDate} />,
  };

  return (
    <div className="everyAgentPage">
      <div className="header">
        <div className="sortDateTime">
          <SortCalendare
            setDateTime={setDateTime}
            dateTime={dateTime}
            active={active}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          {objPdf?.[active]}
        </div>
      </div>
      <div className="body">
        <div className="reportVisit">
          <h5>
            {state?.fio}{" "}
            {active == 4 && (
              <> ( остаток: {reportSummary?.total_start_week} сом)</>
            )}
          </h5>
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
