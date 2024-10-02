import React, { useRef } from "react";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useReactToPrint } from "react-to-print";

// Обязательно прокидываем ref через forwardRef в основной div
const OrderTable = React.forwardRef((props, ref) => (
  <div ref={ref} style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
    <div
      className="container"
      style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
    >
      <div className="header" style={{ marginBottom: "10px" }}>
        <p style={{ margin: "2px 5px 0 0" }}>Отправитель:</p>
        <p style={{ margin: "2px 5px 0 0" }}>
          Отгрузка агенту №0000000020. Исаева Светлана - ТА, 27 августа 2024 г.
        </p>
      </div>
      {/* Можно добавить дополнительные элементы таблицы или текста */}
    </div>
  </div>
));

// Основной компонент для генерации PDF
const GeneratePdf = () => {
  const componentRef = useRef();

  // Добавляем обработчик печати с использованием useReactToPrint
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Передаем ref компонента
    documentTitle: "order_form",
    onAfterPrint: () => console.log("Печать завершена!"),
    onBeforeGetContent: () => console.log("Начало подготовки к печати..."),
    removeAfterPrint: true, // Удаляет содержимое после печати, если нужно
  });

  return (
    <div>
      <OrderTable ref={componentRef} />
      <button onClick={handlePrint} className="sendData generatePdf">
        <FileCopyIcon sx={{ width: 16 }} />
        <p>Сгенерировать документ</p>
      </button>
    </div>
  );
};

export default GeneratePdf;

{
  /* <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
        border="1"
      >
        <thead>
          <tr>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "center" }}>
              №
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "left" }}>
              Наименование
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Заказано
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Кол-во кг
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Кол-во шт
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Расчетное кол-во
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Цена
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Сумма
            </th>
            <th style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              Тара
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "center" }}>
              1
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "left" }}>
              Деликатес Риха Грудак куриные
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              0.37
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              20
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              5.37
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              20
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              200
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}>
              1 989
            </td>
            <td style={{ padding: "2px 5px", fontSize: "10px", textAlign: "right" }}></td>
          </tr>
        </tbody>
      </table> */
}
