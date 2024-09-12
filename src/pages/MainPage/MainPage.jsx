/////// hooks
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState, useEffect } from "react";

////// components
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import ModalOrderCRUD from "../../components/MainPage/Modals/ModalOrderCRUD/ModalOrderCRUD";
import {
  startOfWeek,
  endOfWeek,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ru } from "date-fns/locale";

/////// style
import "./style.scss";

////// helpers
import { confirmAllDay } from "../../helpers/LocalData";
import { transformDateTime } from "../../helpers/transformDate";
import { myAlert } from "../../helpers/MyAlert";

////// fns
import { editInvoice, setActiveDate } from "../../store/reducers/requestSlice";
import { getListOrders } from "../../store/reducers/requestSlice";
import { createInvoice } from "../../store/reducers/requestSlice";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import EveryDateInfo from "../../components/MainPage/EveryDateInfo/EveryDateInfo";
import ModaIngridients from "../../components/MainPage/Modals/ModaIngridients/ModaIngridients";

const MainPage = () => {
  const dispatch = useDispatch();

  const calendarRef = useRef(null);

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { listOrders, activeDate } = useSelector((state) => state.requestSlice);
  const { listTitleOrders } = useSelector((state) => state.requestSlice);
  const { listTA } = useSelector((state) => state.requestSlice);

  const addTodo = (selectInfo) => {
    const date_from = transformDateTime(selectInfo?.start);
    const date_to = transformDateTime(selectInfo?.end);

    // Проверяем, что это не выбор на весь день (т.е. выбранные часы должны отличаться)
    const isAllDaySelection =
      selectInfo?.allDay ||
      (selectInfo?.start?.getHours() == 0 && selectInfo?.end?.getHours() == 0);

    if (isAllDaySelection) {
      myAlert(confirmAllDay);
      return;
    }

    dispatch(createInvoice({ date_from, date_to }));
  };

  function handleEventClick(clickInfo) {}

  // для диапазон для месяца или недели
  const updateDateRange = () => {
    if (calendarRef?.current) {
      const calendarApi = calendarRef.current?.getApi();
      const currentDate = calendarApi?.getDate(); // Получаем активную дату календаря
      const currentView = calendarApi?.view?.type; // Получаем текущее представление (день, неделя, месяц и т.д.)

      if (currentView === "dayGridMonth") {
        // Если текущее представление - это месяц
        dispatch(setActiveDate(getMonthRange(currentDate)));
      } else {
        // Иначе - неделя
        dispatch(setActiveDate(getWeek(currentDate)));
      }
    }
  };

  useEffect(() => {
    updateDateRange();
  }, []);

  useEffect(() => {
    const agents_guid = searchActiveOrdersTA(listTA);
    dispatch(getListOrders({ ...activeDate, agents_guid }));
    //// когда будет меняться диапозон надо get заявки с обновленным диапозоном
  }, [activeDate?.date_from]);

  const handleEventDrop = (content) => {
    const { invoice_guid, status } = content?.event?._def?.extendedProps;
    const oldStart = content?.oldEvent?.start; // Начальная дата до перемещения
    const newStart = content?.event?.start; // Новая начальная дата

    // Если событие перетаскивается в заголовок дня (весь день) или изначально было в заголовке дня
    if (
      content?.event?.allDay ||
      content?.oldEvent?.allDay ||
      content?.event?.start?.getHours() === 0
    ) {
      myAlert("Перетаскивание событий в заголовок дня или из него запрещено!");
      content.revert(); // Отменяем перемещение
      return;
    }

    if (status !== 0) {
      myAlert("Заявка уже в производстве!", "error");
      content.revert();
      return;
    }

    const date_from = transformDateTime(newStart); // Откуда взял
    const date_to = transformDateTime(oldStart); // Куда перетащил

    const data = { date_from, date_to, invoice_guid, status };

    const agents_guid = searchActiveOrdersTA(listTA);

    dispatch(editInvoice({ data, agents_guid, activeDate })); // Редактирование заявок
  };

  return (
    <>
      <div className="mainPage">
        <FullCalendar
          ref={calendarRef}
          height="100%"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "dayGridMonth,timeGridWeek,timeGridDay",
            center: "title",
            right: "prev,next today",
          }}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={addTodo}
          weekends={true}
          initialEvents={[...listOrders, ...listTitleOrders]}
          events={[...listOrders, ...listTitleOrders]}
          eventContent={(e) => <EveryDateInfo content={e} />}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventsSet={updateDateRange}
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
          expandRows={true}
          allDaySlot={user_type == 2} /// отображать только у админа
        />
      </div>
      <ModalOrderCRUD />
      <ModaIngridients />
    </>
  );
};

export default MainPage;

const getWeek = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Начало недели (понедельник)
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Конец недели (воскресенье)
  return {
    date_from: format(start, "yyyy-MM-dd", { locale: ru }),
    // Форматируем дату начала недели
    date_to: format(end, "yyyy-MM-dd", { locale: ru }),
    // Форматируем дату конца недели
  };
};

const getMonthRange = (date) => {
  const start = startOfMonth(date); // Начало месяца
  const end = endOfMonth(date); // Конец месяца
  return {
    date_from: format(start, "yyyy-MM-dd", { locale: ru }),
    // Форматируем дату начала месяца
    date_to: format(end, "yyyy-MM-dd", { locale: ru }),
    // Форматируем дату конца месяца
  };
};
