////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, forwardRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// style
import "./style.scss";

////// components
import ReactDatePicker from "react-datepicker";

////// fns
import {
  getReportPayReq,
  getReportSummaryWeek,
  getSaleAgentReq,
} from "../../../store/reducers/reportsSlice";

////// icons
import EventIcon from "@mui/icons-material/EventNoteTwoTone";

///// helpers
import { ru } from "date-fns/locale";
import { startOfWeek, endOfWeek, format, isValid } from "date-fns";

const SortCalendare = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { dateTime, setDateTime, active } = props;
  const { selectedDate, setSelectedDate } = props;

  const onChangeDate = async (date) => {
    setDateTime(date);
    const send = { agent_guid: state?.guid, date };
    dispatch(getSaleAgentReq(send)); //список товаров, которые ТА продал за какаю-то дату
    dispatch(getReportPayReq(send)); //отчет долгов и оплат ТТ для ТА
  };

  useEffect(() => {
    const send = { agent_guid: state?.guid, date: dateTime };
    dispatch(getSaleAgentReq(send)); //список товаров, которые ТА продал за какаю-то дату
    dispatch(getReportPayReq(send)); //отчет долгов и оплат ТТ для ТА

    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    const data = {
      from: format(start, "yyyy-MM-dd"),
      to: format(end, "yyyy-MM-dd"),
      agent_guid: state?.guid,
    };
    dispatch(getReportSummaryWeek(data));
  }, []);

  ////////////////////////

  const handleWeekChange = (date) => {
    setSelectedDate(date);

    if (!date) return;

    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    const send = {
      from: format(start, "yyyy-MM-dd"),
      to: format(end, "yyyy-MM-dd"),
      agent_guid: state?.guid,
    };

    dispatch(getReportSummaryWeek(send));

    setSelectedDate(date);
  };

  const formattedWeek =
    isValid(selectedDate) &&
    `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "dd MMMM yyyy", {
      locale: ru,
    })} - ${format(
      endOfWeek(selectedDate, { weekStartsOn: 1 }),
      "dd MMMM yyyy",
      { locale: ru }
    )}`;

  if (active == 4) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={handleWeekChange}
          locale={ru}
          customInput={<CustomInput formattedWeek={formattedWeek} />}
          calendarStartDay={1}
        />
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
};

export default SortCalendare;

const CustomInput = forwardRef(({ value, onClick, formattedWeek }, ref) => {
  return (
    <button onClick={onClick} ref={ref} className="calendareWeek">
      {formattedWeek || "Выберите неделю"}
      <EventIcon />
    </button>
  );
});
