////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// components
import ReportSummaryWeekPoints from "../ReportSummaryWeekPoints/ReportSummaryWeekPoints";
import ReportSummaryWeekPays from "../ReportSummaryWeekPays/ReportSummaryWeekPays";
import ReportSummaryWeekSpending from "../ReportSummaryWeekSpending/ReportSummaryWeekSpending";

////// fns

////// icons

///// helpers

////// style
import "./style.scss";

const ReportSummaryWeek = ({}) => {
  const { reportSummary } = useSelector((state) => state.reportsSlice);

  return (
    <div className="reportSummaryWeekMain">
      <ReportSummaryWeekPays />
      <div className="reportSummaryWeekMain__inner">
        <div className="list">
          <ReportSummaryWeekPoints
            list={reportSummary?.bs_point}
            title={"Долги по магазинам БЦ"}
            firstTitle={"№"}
            firstKey={"index"}
          />
          <ReportSummaryWeekPoints
            list={reportSummary?.ft_point}
            title={"Отчёт по магазинам ФТ"}
            firstTitle={"Дата"}
            firstKey={"date"}
          />
        </div>
        <div className="list">
          <ReportSummaryWeekPoints
            list={reportSummary?.market_point}
            title={"Отчёт по маркетам"}
            firstTitle={"Дата"}
            firstKey={"date"}
          />
          <ReportSummaryWeekSpending list={reportSummary?.ta_spending} />
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryWeek;
