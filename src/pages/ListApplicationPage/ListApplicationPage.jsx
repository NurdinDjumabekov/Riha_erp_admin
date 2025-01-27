////////
///// hooks
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useEffect, useState } from "react";

////// components
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import EveryDateInfo from "../../components/MainPage/EveryDateInfo/EveryDateInfo";
import MainMenuAgents from "../../components/Menu/MenuLeft/MainMenuAgents";
import ModalOrderCRUD from "../../components/MainPage/Modals/ModalOrderCRUD/ModalOrderCRUD";
import ModaIngridients from "../../components/MainPage/Modals/ModaIngridients/ModaIngridients";

////// helpers
import { confirmAllDay } from "../../helpers/LocalData";
import { addToDateFN, transformDateTime } from "../../helpers/transformDate";
import { myAlert } from "../../helpers/MyAlert";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import { getMonthRange, getMyWeek } from "../../helpers/weeks";
import { listStatusOrders } from "../../helpers/objs";

////// fns
import {
  clearListOrdersAgents,
  editInvoice,
  getListTA,
  getListTitleOrders,
  setInvoiceInfo,
} from "../../store/reducers/mainSlice";
import { setActiveDate } from "../../store/reducers/mainSlice";
import { getListOrders } from "../../store/reducers/mainSlice";
import { createInvoice } from "../../store/reducers/mainSlice";

////// icons

/////// style
import "./style.scss";

const ListApplicationPage = () => {
  const dispatch = useDispatch();

  const calendarRef = useRef(null);

  const [mainCheckBox, setMainCheckBox] = useState(true);

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { listOrders, activeDate } = useSelector((state) => state.mainSlice);
  const { listTitleOrders } = useSelector((state) => state.mainSlice);
  const { listTA } = useSelector((state) => state.mainSlice);

  const addTodo = (selectInfo) => {
    ////// from date
    const date_from_mob = transformDateTime(selectInfo?.date);
    const date_from_desc = transformDateTime(selectInfo?.start);

    const date_from = !!selectInfo?.start ? date_from_desc : date_from_mob;

    ////// to date
    const date_to_mob = addToDateFN(transformDateTime(selectInfo?.date));
    const date_to_desc = transformDateTime(selectInfo?.end);

    const date_to = !!selectInfo?.end ? date_to_desc : date_to_mob;

    // Проверяем, что это не выбор на весь день (т.е. выбранные часы должны отличаться)
    const isAllDaySelection =
      selectInfo?.allDay ||
      (selectInfo?.start?.getHours() == 0 && selectInfo?.end?.getHours() == 0);

    if (isAllDaySelection) {
      myAlert(confirmAllDay);
      return;
    }

    if (user_type == 1) {
      /// создаю заявку для цеха от имени ТА
      dispatch(createInvoice({ date_from, date_to }));
    }
    if (user_type == 2) {
      /// создаю заявку для цеха от имени ТА выбрав через админку
      /// временно создам для открытия модалки
      const obj = { date_from, date_to, guid: "временно создан", action: 1 };
      dispatch(setInvoiceInfo(obj)); //// 1 - создание
      //// guidShadow - только для админа
    }
  };

  ///// для диапазон месяца или недели
  const updateDateRange = (e) => {
    if (calendarRef?.current) {
      const calendarApi = calendarRef.current?.getApi();
      const currentDate = calendarApi?.getDate(); // Получаем активную дату календаря
      const currentView = calendarApi?.view?.type; // Получаем текущее представление (день, неделя, месяц и т.д.)

      if (currentView === "dayGridMonth") {
        dispatch(setActiveDate(getMonthRange(currentDate)));
      } else {
        dispatch(setActiveDate(getMyWeek(currentDate)));
      }
    }
  };

  const getData = async () => {
    const res = await dispatch(getListTA()).unwrap();
    const agents_guid = searchActiveOrdersTA(res);
    setMainCheckBox(agents_guid?.length > 7 ? true : false);
    // главый CheckBox на главной страние, при нажатии у всех агентов разом меняются отображения заявок
  };

  const getOrders = async () => {
    const res = await dispatch(getListTA()).unwrap();
    const agents_guid = searchActiveOrdersTA(res);
    let send = { ...activeDate, agents_guid };
    if (agents_guid?.length == 0) {
      send = {
        ...activeDate,
        agents_guid: ["88F8CF21-F5D0-4F55-BC33-B168D739D1D4"],
      };
    }
    dispatch(getListOrders(send));
    dispatch(getListTitleOrders(send)); //// get данные целой недели
  };

  useEffect(() => {
    getData();
    return () => dispatch(clearListOrdersAgents());
  }, []);

  useEffect(() => {
    getOrders();
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

    if (status == 1 || status == 2) {
      myAlert("Заявка уже в производстве!", "error");
      content.revert();
      return;
    }

    if (status == -2) {
      myAlert("Идёт подготовка к производству!", "error");
      content.revert();
      return;
    }

    if (status == 3) {
      const text = "Заявка уже была обработана, редактирование невозможно!";
      myAlert(text, "error");
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
    <div className="mainCalendare">
      <div className="ListApplicationPage">
        <div className="ListApplicationPage__inner">
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
            dateClick={addTodo}
            weekends={true}
            initialEvents={[...listOrders, ...listTitleOrders]}
            events={[...listOrders, ...listTitleOrders]}
            eventContent={(e) => <EveryDateInfo content={e} />}
            eventDrop={handleEventDrop}
            eventsSet={updateDateRange}
            slotMinTime="05:00:00"
            slotMaxTime="24:00:00"
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
            titleFormat={{ month: "long" }}
            eventResizableFromStart={false} // Отключаю возможность изменения размера с начала
            eventDurationEditable={false}
          />
          <div className="listInfo">
            {listStatusOrders?.map((i, ind) => (
              <div className="listInfo__every" key={ind}>
                <>{i?.icon}</> - <p>{i?.text}</p>
              </div>
            ))}
          </div>
        </div>
        <MainMenuAgents
          mainCheckBox={mainCheckBox}
          setMainCheckBox={setMainCheckBox}
        />
      </div>
      {/* <ModalOrderCRUD />
      <ModaIngridients /> */}
    </div>
  );
};

export default ListApplicationPage;
