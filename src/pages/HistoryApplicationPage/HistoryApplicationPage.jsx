////// hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// helpers
import { addDays, format } from "date-fns";
import { ru } from "date-fns/locale";

////// fns
import {
  clearListOrdersAgents,
  getListOrders,
  getListProdsInInvoice,
} from "../../store/reducers/mainSlice";
import { activeAgentFN } from "../../store/reducers/standartStateSlice";

////// components
import InfoProds from "../../components/HistoryApplicationPage/InfoProds/InfoProds";
import ListSearchTA from "../../common/ListSearchTA/ListSearchTA";

////// style
import "./style.scss";

const HistoryApplicationPage = () => {
  const dispatch = useDispatch();

  const { activeAgent } = useSelector((state) => state.standartStateSlice);
  const { activeDateDay } = useSelector((state) => state.standartStateSlice);

  const [activeInvoice, setActiveInvoice] = useState("");

  useEffect(() => {
    getStartData();

    return () => dispatch(clearListOrdersAgents());
  }, []);

  const clickAgent = (agent) => {
    dispatch(activeAgentFN(agent));
    const data = {
      date_from: activeDateDay,
      date_to: format(addDays(new Date(activeDateDay), 1), "yyyy-MM-dd", {
        locale: ru,
      }),
    };
    const obj = { agents_guid: [agent?.guid], history: 1 };
    getInvoiceProds({ ...data, ...obj, history: 1 });
  };

  const getStartData = async () => {
    const data = {
      date_from: activeDateDay,
      date_to: format(addDays(new Date(activeDateDay), 1), "yyyy-MM-dd", {
        locale: ru,
      }),
    };
    const obj = { agents_guid: [activeAgent?.guid] };
    if (!!activeAgent?.guid) getInvoiceProds({ ...data, ...obj, history: 1 });
  };

  const getInvoiceProds = async (send) => {
    const res = await dispatch(getListOrders(send)).unwrap();
    // get список историй заявок
    const firstGuid = res?.[0]?.invoice_guid;
    if (!!firstGuid) {
      dispatch(getListProdsInInvoice(firstGuid)); //// для получения товаров
      setActiveInvoice(firstGuid); /// для активной накладной
    }
  };

  return (
    <div className="hitoryTA">
      <div className="hitoryTA__main">
        <ListSearchTA clickAgent={clickAgent} />
        <InfoProds
          activeInvoice={activeInvoice}
          setActiveInvoice={setActiveInvoice}
          getInvoiceProds={getInvoiceProds}
        />
      </div>
    </div>
  );
};

export default HistoryApplicationPage;
