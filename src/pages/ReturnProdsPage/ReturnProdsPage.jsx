////// hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

////// icons
import user from "../../assets/images/iAm.jpg";
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

////// fns
import { getListTA } from "../../store/reducers/mainSlice";
import {
  getListInvoiceReturns,
  getListProdsReturns,
} from "../../store/reducers/invoiceSlice";

////// components
import { Tooltip } from "@mui/material";
import TableReturn from "../../components/ReturnProdsPage/TableReturn/TableReturn";
import DatePicker from "react-datepicker";

////// style
import "./style.scss";

////// helpers
import { styleTooltip } from "../../helpers/LocalData";
import { transformActionDate } from "../../helpers/transformDate";

const ReturnProdsPage = () => {
  const dispatch = useDispatch();
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const [active, setActive] = useState(""); //// активный ТА
  const [activeInvoice, setActiveInvoice] = useState(""); //// активная накладная
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const { listTA } = useSelector((state) => state.mainSlice);

  const clickAgent = async (agent_guid) => {
    setActive(agent_guid); //// активный ТА
    const sendData = {
      reciever_guid: dataSave.guid,
      sender_guid: agent_guid,
      date_from: transformActionDate(dateRange?.[0]),
      date_to: transformActionDate(dateRange?.[1]),
    };
    const invoices = await dispatch(getListInvoiceReturns(sendData)).unwrap(); // get список накладных возврата
    dispatch(getListProdsReturns(invoices?.[0]?.invoice_guid)); // get список товаров возврата
    setActiveInvoice(invoices?.[0]?.invoice_guid); //// активная накладная
  };

  const onChangeDate = async (item) => {
    setDateRange(item);

    if (!!item?.[1]) {
      ///// сортировка возврата товара по дате
      const sendData = {
        reciever_guid: dataSave.guid,
        sender_guid: active,
        date_from: transformActionDate(item?.[0]),
        date_to: transformActionDate(item?.[1]),
      };
      const invoices = await dispatch(getListInvoiceReturns(sendData)).unwrap(); // get список накладных возврата
      dispatch(getListProdsReturns(invoices?.[0]?.invoice_guid)); // get список товаров возврата
      setActiveInvoice(invoices?.[0]?.invoice_guid); //// активная накладная
    }
  };

  const getData = async () => {
    try {
      const list = await dispatch(getListTA({ first: false })).unwrap();
      setActive(list?.[0]?.guid);
      const sendData = {
        reciever_guid: dataSave.guid,
        sender_guid: list?.[0]?.guid,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[1]),
      };
      const invoices = await dispatch(getListInvoiceReturns(sendData)).unwrap(); // get список накладных возврата
      dispatch(getListProdsReturns(invoices?.[0]?.invoice_guid)); // get список товаров возврата
      setActiveInvoice(invoices?.[0]?.invoice_guid); //// активная накладная
    } catch (error) {}
  };

  useEffect(() => {
    getData();
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
          {/* <h6>Торговые агенты</h6>
          <div className="line"></div> */}
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
        <TableReturn
          activeInvoice={activeInvoice}
          setActiveInvoice={setActiveInvoice}
        />
      </div>
    </div>
  );
};

export default ReturnProdsPage;
