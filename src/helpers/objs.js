///////
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

///////
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

/////// icons
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import TaxiAlertIcon from "@mui/icons-material/TaxiAlert";
import ListAltIcon from "@mui/icons-material/ListAlt";

/////// icons
import RoomIcon from "@mui/icons-material/Room";
import HistoryIcon from "@mui/icons-material/History";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import time from "../assets/images/back-in-time.png";
import calendare from "../assets/images/calendar.png";
import prod from "../assets/images/web-settings.png";
import end from "../assets/images/good-signal.png";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PaymentsIcon from "@mui/icons-material/Payments";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import RestartAltIcon from "@mui/icons-material/EditCalendar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PeopleIcon from "@mui/icons-material/People";

export const listMenu = [
  {
    section: "Заявки агентов",
    label: "Заявки агентов",
    icon: <TextSnippetIcon sx={{ color: "#0000008c" }} />,
    iconActive: <TextSnippetIcon sx={{ color: "#1565c0" }} />,
    path: "/orders",
    items: [
      {
        label: "Календарь заявок",
        icon: <CalendarMonthIcon sx={{ color: "#0000008c" }} />,
        iconActive: <CalendarMonthIcon sx={{ color: "#1565c0" }} />,
        path: `/orders/main`,
      },
      {
        label: "История заявок",
        icon: <ManageSearchIcon sx={{ color: "#0000008c" }} />,
        iconActive: <ManageSearchIcon sx={{ color: "#1565c0" }} />,
        path: `/orders/history`,
      },
    ],
  },
  {
    section: "Производство",
    label: "Производство",
    icon: <AddBusinessIcon sx={{ color: "#0000008c" }} />,
    iconActive: <AddBusinessIcon sx={{ color: "#1565c0" }} />,
    path: "/production",
    items: [
      {
        label: "Коптильщики",
        icon: <PeopleIcon sx={{ color: "#0000008c" }} />,
        iconActive: <PeopleIcon sx={{ color: "#1565c0" }} />,
        path: `/production/coptil`,
      },
      {
        label: "История производства",
        icon: <ManageSearchIcon sx={{ color: "#0000008c" }} />,
        iconActive: <ManageSearchIcon sx={{ color: "#1565c0" }} />,
        path: `/production/invoice`,
      },
    ],
  },
  {
    section: "Склад",
    label: "Склад",
    icon: <HomeWorkIcon sx={{ color: "#0000008c" }} />,
    iconActive: <HomeWorkIcon sx={{ color: "#1565c0" }} />,
    path: "/ware_home",
  },
  {
    section: "Маршруты ТА",
    label: "Маршруты ТА",
    icon: <TaxiAlertIcon sx={{ color: "#0000008c" }} />,
    iconActive: <TaxiAlertIcon sx={{ color: "#1565c0" }} />,
    path: "/route",
  },
  {
    section: "Отчеты ТА",
    label: "Отчеты ТА",
    icon: <ListAltIcon sx={{ color: "#0000008c" }} />,
    iconActive: <ListAltIcon sx={{ color: "#1565c0" }} />,
    path: "/report_ta/agents",
  },

  {
    section: "Касса",
    label: "Касса",
    icon: <PaymentsIcon sx={{ color: "#0000008c" }} />,
    iconActive: <PaymentsIcon sx={{ color: "#1565c0" }} />,
    path: "/pay",
  },

  {
    section: "Возврат товара",
    label: "Возврат товара",
    icon: <RestartAltIcon sx={{ color: "#0000008c" }} />,
    iconActive: <RestartAltIcon sx={{ color: "#1565c0" }} />,
    path: "/return_prod",
  },
  {
    section: "Задания от руководителя",
    label: "Задания от руководителя",
    icon: <AssignmentIcon sx={{ color: "#0000008c" }} />,
    iconActive: <AssignmentIcon sx={{ color: "#1565c0" }} />,
    path: "/tasks",
  },
  {
    section: "Траты",
    label: "Траты",
    icon: <ChecklistRtlIcon sx={{ color: "#0000008c" }} />,
    iconActive: <ChecklistRtlIcon sx={{ color: "#1565c0" }} />,
    path: "/spending",
  },
];

export const objStatusOrders = {
  0: {
    text: "Заявка подана",
    img: calendare,
    color: "#2196f3",
    class: "edit",
    icon: <InventoryOutlinedIcon />,
  },
  "-2": {
    text: "Идёт подготовка к производству, редактирование невозможно!",
    img: time,
    color: "#e7515a",
    class: "noEdit",
    icon: <InventoryOutlinedIcon />,
  },
  1: {
    text: "Заявка уже в производстве",
    img: prod,
    color: "#4361ee",
    class: "prod",
    icon: <AccessTimeOutlinedIcon />,
  },
  2: {
    text: "Товары на складе и готовы к отгрузке",
    img: end,
    color: "#00ab55",
    class: "sgp",
    icon: <CheckCircleOutlinedIcon />,
  },
  3: {
    text: "Отгружено торговому агенту",
    img: end,
    color: "#00ab55",
    class: "sgp",
    icon: <CheckCircleOutlinedIcon />,
  },
};

export const objStatusOrdersMini = {
  0: "Заявка подана",
  "-2": "Подготовка к производству",
  1: "В производстве",
  2: "Товары на складе",
  3: "Отгружено торговому агенту",
};

export const listStatusOrders = [
  {
    text: "Заявка подана",
    img: calendare,
    color: "#2196f3",
    class: "edit",
    icon: <InventoryOutlinedIcon />,
  },
  // {
  //   text: "Идёт подготовка к производству, редактирование невозможно!",
  //   img: time,
  //   color: "#e7515a",
  //   class: "noEdit",
  //   icon: <InventoryOutlinedIcon />,
  // },
  {
    text: "Заявка уже в производстве",
    img: prod,
    color: "#4361ee",
    class: "prod",
    icon: <AccessTimeOutlinedIcon />,
  },
  {
    text: "Товары на складе и готовы к отгрузке",
    img: end,
    color: "#00ab55",
    class: "sgp",
    icon: <CheckCircleOutlinedIcon />,
  },
  // {
  //   text: "Товары на складе и готовы к отгрузке",
  //   img: end,
  //   color: "#00ab55",
  //   class: "sgp",
  //   icon: <CheckCircleOutlinedIcon />,
  // },
];

export const objActionInvoice = {
  1: {
    text: "Сохранить",
    img: <LibraryAddIcon sx={{ width: 16, height: 16 }} />,
  },
  2: {
    text: "Редактировать",
    img: <BorderColorOutlinedIcon sx={{ width: 16, height: 16 }} />,
  },
};

export const listActionsTitle = [
  {
    id: 1,
    name: "Список товаров",
    img: <ContentPasteSearchOutlinedIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: (
      <ContentPasteSearchOutlinedIcon sx={{ color: "#1976d2", width: 16 }} />
    ),
  },
  {
    id: 2,
    name: "Ингредиенты",
    img: <ChecklistRtlIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: <ChecklistRtlIcon sx={{ color: "#1976d2", width: 16 }} />,
  },
  {
    id: 3,
    name: "Замесы",
    img: <EventRepeatIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: <EventRepeatIcon sx={{ color: "#1976d2", width: 16 }} />,
  },
];

export const objStatusText = { 1: "Товар добавлен!", 2: "Товар обновлён!" };

export const listActionRoute = [
  {
    id: 1,
    title: "Координаты всех ТА",
    icon: <RoomIcon sx={{ color: "#fff" }} />,
    link: "/",
  },
  {
    id: 2,
    title: "Список маршрутов",
    icon: <ChecklistRtlIcon sx={{ color: "#fff" }} />,
    link: "/",
  },
  {
    id: 3,
    title: "История маршрутов",
    icon: <HistoryIcon sx={{ color: "#fff" }} />,
    link: "/",
  },
];

export const styleRoutes = {
  routeLineWidth: ["interpolate", ["linear"], ["zoom"], 5, 1, 2, 3],
  substrateLineWidth: ["interpolate", ["linear"], ["zoom"], 1, 3, 2, 5],
  haloLineWidth: 5,
};

export const styleRoutesNoPlan = {
  routeLineWidth: ["interpolate", ["linear"], ["zoom"], 5, 1, 2, 3],
  substrateLineWidth: ["interpolate", ["linear"], ["zoom"], 1, 3, 2, 5],
  haloLineWidth: 15,
};

export const listAcceptInvoiceTem = [
  {
    codeid: 1,
    guid: "qcwerqwrqwerqwer32",
    total_price: 100,
    date_create: "22-10-2024 19:00",
    file: "http://mttp-renaissance.333.kg/files/5P4ZMTXT9RNEosDmFLCvXB60k.pdf",
    sender: "админ",
  },
  {
    codeid: 2,
    guid: "231123",
    total_price: 100,
    date_create: "22-10-2024 19:00",
    file: "http://mttp-renaissance.333.kg/files/5P4ZMTXT9RNEosDmFLCvXB60k.pdf",
    sender: "админ",
  },
  {
    codeid: 3,
    guid: "asdasdas",
    total_price: 100,
    date_create: "22-10-2024 19:00",
    file: "http://mttp-renaissance.333.kg/files/5P4ZMTXT9RNEosDmFLCvXB60k.pdf",
    sender: "админ",
  },
];

export const objStatusTasks = {
  1: "Добавить задачу для торгового агента",
  2: "Редактировать",
};

export const objStatusSpending = {
  1: "Добавить трату торгового агента",
  2: "Редактировать",
};

export const listStatusSpending = [
  { label: "Принять", value: "1" },
  { label: "Отклонить", value: "2" },
];

export const statusAll = { 1: "#299b31", 2: "red" };

export const styleIconDel = {
  color: "rgba(213, 42, 42, 0.848)",
  width: 20,
  height: 20,
};

export const statusStandart = {
  0: { text: "Ожидание", color: "red" },
  1: { text: "Принят", color: "green" },
  2: { text: "Отклонён", color: "red" },
};
