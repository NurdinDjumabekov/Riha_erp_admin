import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import SendIcon from "@mui/icons-material/SendToMobile";
import PaymentsIcon from "@mui/icons-material/Payments";

import HistoryIcon from "@mui/icons-material/History";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import InsertCommentIcon from "@mui/icons-material/InsertComment";

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "целый день",
    start: todayStr,
    total_price: "1000",
    agent: "Джумабеков Нурдин",
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
];

export function createEventId() {
  return String(eventGuid++);
}

export const texts =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernaturbeatae eaque placeat necessitatibus, iste iure ipsa ad autem repellendusofficia commodi sequi optio rerum vero? Provident nemo illum autem utquae. Itaque magni illo fuga.";

export const confirmAllDay =
  "Нельзя добавить событие на весь день. Пожалуйста, выберите временной интервал.";

export const pointsTT = [
  {
    coordinates: [74.5573735, 42.8508586],
    text: "Marker 1",
  },
  {
    coordinates: [74.5593735, 42.8508586],
    text: "Marker 2",
  },
  {
    coordinates: [74.5173735, 42.8508586],
    text: "Marker 3",
  },
  {
    coordinates: [74.5373735, 42.8578586],
    text: "Marker 4",
  },
  {
    coordinates: [74.5573735, 42.8298586],
    text: "Marker 5",
  },
];

const segments = [
  {
    color: "#43e843",
    label: "A",
    coords: [
      [74.5907, 42.8765], // Пункт А (начало маршрута)
      [74.5922, 42.8751], // Дорога 1
      [74.5944, 42.874], // Дорога 2
    ],
  },

  {
    color: "#43e843",
    label: "B",
    coords: [
      [74.5944, 42.874], // Переход на другой сегмент
      [74.5966, 42.8725], // Дорога 3
      [74.5988, 42.871], // Дорога 4
      [74.5988, 42.871], // Пункт B (конец маршрута)
      [74.6009, 42.8695], // Дорога 5
    ],
  },
];

export const listRouteAllTAMy = [
  {
    id: 1,
    fio: "Бакытова Анара ПФБ - ТА",
    latitude: 42.874722,
    longitude: 74.612222,
    duty: 100,
  },
  {
    id: 2,
    fio: "Алдаянов Эрлан П-1 ТА",
    latitude: 42.8803,
    longitude: 74.595,
    duty: 1200,
  },
  {
    id: 3,
    fio: "Бакытова Анара ПФБ - ТА",
    latitude: 42.87,
    longitude: 74.6,
    duty: 9000,
  },
  {
    id: 4,
    fio: "Бейшекеева Анара (Сарманова) П-1 ТА",
    latitude: 42.8775,
    longitude: 74.59,
    duty: 7600,
  },
  {
    id: 5,
    fio: "Бейшекеева Анара (Сарманова) П-1 ТА",
    latitude: 42.885,
    longitude: 74.629876,
    duty: 87600,
  },
  {
    agent: "Джумабеков Нурдин",
    agent_guid: "B3120F36-3FCD-4CA0-8346-484881974846",
    lat: "42.8451084",
    lon: "74.6176045",
    date: "2024-09-24 12:46",
    codeid: "622",
    date_system: "2024-09-24T12:38:46.760Z",
    rn: "1",
  },
];

const coords = [
  {
    comment: "",
    end_time: "15:39",
    guid: "5CED9EA0-8F98-4221-9BF9-5B902AF84987",
    lat: "42.844673",
    lon: "74.619599",
    ordering: 3,
    point: "Джантошева 97A",
    point_guid: "74AE9AB8-1C3D-11E7-82A3-000C2986F897",
    route_sheet_guid: "F0AC18EE-2015-404C-A4B8-F2C847268C3A",
    start_time: "15:20",
    status: 1,
  },
  {
    comment: "",
    end_time: "15:39",
    guid: "5CED9EA0-8F98-4221-9BF9-5B902AF84987",
    lat: "42.85734168574616",
    lon: "74.5963286810956",
    ordering: 3,
    point: "к. Шота Руставели ",
    point_guid: "74AE9AB8-1C3D-11E7-82A3-000C2986F897",
    route_sheet_guid: "F0AC18EE-2015-404C-A4B8-F2C847268C3A",
    start_time: "15:20",
    status: 1,
  },
  {
    comment: "",
    end_time: "15:39",
    guid: "5CED9EA0-8F98-4221-9BF9-5B902AF84987",
    lat: "42.86142814852352",
    lon: "74.5873528201789",
    ordering: 3,
    point: "к. Шота Руставели ",
    point_guid: "74AE9AB8-1C3D-11E7-82A3-000C2986F897",
    route_sheet_guid: "F0AC18EE-2015-404C-A4B8-F2C847268C3A",
    start_time: "15:20",
    status: 1,
  },
  {
    comment: "",
    end_time: "15:39",
    guid: "5CED9EA0-8F98-4221-9BF9-5B902AF84987",
    lat: "42.86674719048398",
    lon: "74.63610611708658",
    ordering: 3,
    point: "к. Шота Руставели ",
    point_guid: "74AE9AB8-1C3D-11E7-82A3-000C2986F897",
    route_sheet_guid: "F0AC18EE-2015-404C-A4B8-F2C847268C3A",
    start_time: "15:20",
    status: 1,
  },
];

export const listActions_TA = [
  {
    id: 1,
    name: "Произвести выгрузку",
    icon: <SendIcon />,
    color: "#00ab55",
    link: "/send_app",
  },
  {
    id: 2,
    name: "Прикрепить фото и видео",
    icon: <AddAPhotoIcon />,
    color: "#2196f3",
    link: "/maps_camera",
  },
  {
    id: 3,
    name: "Забрать деньги",
    icon: <PaymentsIcon />,
    color: "#805dca",
    link: "/take_money",
  },
  {
    id: 4,
    name: "Добавить комментарий",
    icon: <InsertCommentIcon />,
    color: "#e2a03f",
    link: "/take_money",
  },
];

const asda = {
  comment: "",
  end_time: "12:10",
  guid: "8B2FA324-1A9D-4E17-BC28-961E29C6B7B5",
  lat: "42.892466738541785",
  lon: "74.53660586276366",
  ordering: 2,
  point: "к. Восток-5 (базар) ",
  guid_point: "0F981F22-1C3C-11E7-82A3-000C2986F897",
  route_sheet_guid: "F384863D-F97E-46EE-8437-BD1395713306",
  seller_fio: "Сухорукова Светлана Ивановна",
  seller_number: "755369169",
  seller_photo:
    "https://st2.depositphotos.com/1003098/5850/i/450/depositphotos_58506567-stock-photo-salespeople-standing-in-hardware-store.jpg",
  set_end_time: null,
  set_start_time: null,
  start_time: "11:50",
  status: 1,
};

export const logoSeller =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBoEakbCXS0yKg6yRKEsmsMyf9qbMLhwBEyokbVraQoK0ZarRTmE4GjmOI5tjkpCWaLY&usqp=CAU";

export const pastGeoData = {
  end_time: "",
  ordering: "",
  status: 1,
  comment: "",
  set_start_time: null,
  set_end_time: null,
  point_guid: "",
  start_time: "02.10.2024",
  route_sheet_guid: "",
  guid: "",
  myGeo: true,
  point: "Стартовая точка",
};

export const menuProduction = [
  {
    id: 1,
    name: "Производство",
    icons: <ChecklistIcon sx={{ color: "#fff" }} />,
  },
  {
    id: 2,
    name: "Реестр производства",
    icons: <HistoryIcon sx={{ color: "#fff" }} />,
  },
];

export const objStatusInvoice = {
  0: { text: "В ожидании", color: "red" },
  1: { text: "Подтверждён админом", color: "#299b31" },
  2: { text: "Подтверждён ТА", color: "#299b31" },
};

export const listStatus = [
  {
    id: 1,
    text: "",
    icon: "",
  },
];

export const styleTooltip = {
  width: 140,
  height: 140,
  borderRadius: "50%",
  objectFit: "cover",
};

export const listWeelSummary = [
  {
    guid: "12",
    date: "22.12.2024",
    income: "100",
    outcome: "1231",
    kassa: "3242",
    return: "2131",
    spending: "21993",
    leftovers_day: "12312",
  },
  {
    guid: "11",
    date: "22.12.2024",
    income: "1321876600",
    outcome: "11231",
    kassa: "32342",
    return: "212131",
    spending: "21993",
    leftovers_day: "12312",
  },
  {
    guid: "131",
    date: "22.12.2024",
    income: "1020",
    outcome: "123231",
    kassa: "32442",
    return: "2546131",
    spending: "21993",
    leftovers_day: "12312",
  },
  {
    guid: "2221",
    date: "22.12.2024",
    income: "10412670",
    outcome: "1123231",
    kassa: "3242342",
    return: "23212344131",
    spending: "21993",
    leftovers_day: "12312",
  },
  {
    guid: "561",
    date: "22.12.2024",
    income: "10122134120",
    outcome: "12123431",
    kassa: "324122",
    return: "2187631",
    spending: "21993",
    leftovers_day: "12312",
  },
];
export const listWeelSummaryBC = [
  {
    guid_point: "asdasasda",
    name: "к. 8 микро",
    adders: "к. 8 микро",
    dolg: "7685",
  },
  {
    guid_point: "sada",
    name: "к. Чокморова",
    adders: "к. Чокморова",
    dolg: "123",
  },
  { guid_point: "s324ada", name: "к. Айни", adders: "к. Айни", dolg: "3423" },
];
