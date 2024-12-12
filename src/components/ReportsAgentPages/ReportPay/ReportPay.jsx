////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

////// components
import ReportPayList from "../ReportPayList/ReportPayList";
import GraphicsPayPoints from "../GraphicsPayPoints/GraphicsPayPoints";

////// fns

////// icons

///// helpers

const ReportPay = () => {
  const { reportPays } = useSelector((state) => state.reportsSlice);

  return (
    <>
      <div className="reportPay">
        <ReportPayList
          list={reportPays?.list_point}
          title={"Долги торговых точек"}
          titleTableCenter={"Адрес"}
          titleKeyCenter={"address"}
        />
        <ReportPayList
          list={reportPays?.list_transactions}
          title={"История оплат точек"}
          titleTableCenter={"Время"}
          titleKeyCenter={"date"}
        />
      </div>
      <div className="graphisc">
        <GraphicsPayPoints list={reportPays?.list_point} />
      </div>
    </>
  );
};

export default ReportPay;
