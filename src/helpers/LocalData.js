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

// console.log(INITIAL_EVENTS, "INITIAL_EVENTS");

export function createEventId() {
  return String(eventGuid++);
}

export const generateColor = () => {
  ///// delete
  // Функция для генерации случайного числа в диапазоне [128, 255]
  const randomBrightValue = () => Math.floor(Math.random() * (256 - 128) + 128);

  // Генерируем три случайных ярких значения для RGB
  const r = randomBrightValue();
  const g = randomBrightValue();
  const b = randomBrightValue();

  // Преобразуем RGB в HEX
  const toHex = (num) => num.toString(16).padStart(2, "0").toUpperCase();

  // Возвращаем цвет в формате HEX
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const texts =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernaturbeatae eaque placeat necessitatibus, iste iure ipsa ad autem repellendusofficia commodi sequi optio rerum vero? Provident nemo illum autem utquae. Itaque magni illo fuga. Deleniti aliquam quos sequi unde ipsumquod cumque ab velit odit iure maiores ullam, quam accusantiumpraesentium exercitationem quas reiciendis, ipsam hic ratione esse.Optio ullam sunt ad molestiae in, repellendus fugiat quis eveniet quos.Dignissimos quidem consequatur impedit velit modi incidunt sequi,tenetur delectus error rem reprehenderit sit optio veritatis ipsamitaque quo dolore, quaerat voluptatum temporibus animi. Cumque autemquae repudiandae! Omnis, aperiam.";
