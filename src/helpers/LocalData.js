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