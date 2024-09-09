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
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernaturbeatae eaque placeat necessitatibus, iste iure ipsa ad autem repellendusofficia commodi sequi optio rerum vero? Provident nemo illum autem utquae. Itaque magni illo fuga. Deleniti aliquam quos sequi unde ipsumquod cumque ab velit odit iure maiores ullam, quam accusantiumpraesentium exercitationem quas reiciendis, ipsam hic ratione esse.Optio ullam sunt ad molestiae in, repellendus fugiat quis eveniet quos.Dignissimos quidem consequatur impedit velit modi incidunt sequi,tenetur delectus error rem reprehenderit sit optio veritatis ipsamitaque quo dolore, quaerat voluptatum temporibus animi. Cumque autemquae repudiandae! Omnis, aperiam.";

export const confirmAllDay =
  "Нельзя добавить событие на весь день. Пожалуйста, выберите временной интервал.";
