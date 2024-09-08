/////// hooks
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";

////// components
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import EveryDateInfo from "../../components/MainPage/EveryDateInfo/EveryDateInfo";

/////// style
import "./style.scss";

////// helpers
import { generateColor } from "../../helpers/LocalData";
import { transformDateTime } from "../../helpers/transformDate";

////// fns
import { addOrdersInList } from "../../store/reducers/requestSlice";
import ModalOrderCRUD from "../../components/MainPage/ModalOrderCRUD/ModalOrderCRUD";

const MainPage = () => {
  const dispatch = useDispatch();

  const { listOrders, listTA } = useSelector((state) => state.requestSlice);

  const [modalOrder, setModalOrder] = useState(false);

  // console.log(listOrders, "listOrders");

  const addTodo = (selectInfo) => {
    setModalOrder(true); /// открываю модалку
    // const start = transformDateTime(selectInfo.start);
    const start = transformDateTime(selectInfo.start);
    const date_to = transformDateTime(selectInfo.end);

    dispatch(
      addOrdersInList({
        start,
        title: "asdasdas",
        allDay: false, /// для всего дня
        color: generateColor(),
        status: 1,
        total_price: "1000",
        agent: "Джумабеков Нурдин",
      })
    );
  };

  function handleEventClick(clickInfo) {
    // if (
    //   confirm(
    //     `Are you sure you want to delete the event '${clickInfo.event.title}'`
    //   )
    // ) {
    //   clickInfo.event.remove();
    // }
  }

  function handleEvents(events) {
    // console.log(events, "12312");
  }

  return (
    <>
      <div className="mainPage">
        <FullCalendar
          height="100%"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={addTodo}
          weekends={true}
          initialEvents={listOrders}
          events={listOrders}
          eventContent={EveryDateInfo}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
          slotMinTime="05:00:00"
          slotMaxTime="22:00:00"
          slotLabelInterval="01:00"
          slotDuration="01:00"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          locale={ruLocale}
          style={{ height: "100vh", width: "100%" }}
          expandRows={true}
        />
      </div>
      <ModalOrderCRUD props={{ setModalOrder, modalOrder }} />
    </>
  );
};

export default MainPage;
