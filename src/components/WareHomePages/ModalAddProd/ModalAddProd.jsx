import { useEffect, useRef, useState } from "react";
import Modals from "../../../common/Modals/Modals";
import "./style.scss";

const ModalAddProd = (props) => {
  const { closeModal, modal } = props;
  const [obj, setObj] = useState({});
  const inputRefs = useRef([]); // Массив для хранения ссылок на input и кнопки

  // Функция для добавления ссылки в массив
  const setRef = (el, index) => {
    inputRefs.current[index] = el;
  };

  const handleKeyDown = (event) => {
    const currentIndex = inputRefs.current.findIndex(
      (ref) => ref === document.activeElement
    );

    if (
      event.key === "ArrowDown" &&
      currentIndex < inputRefs.current.length - 1
    ) {
      inputRefs.current[currentIndex + 1]?.focus();
      event.preventDefault(); // Предотвращение стандартного поведения
    }

    if (event.key === "ArrowUp" && currentIndex > 0) {
      inputRefs.current[currentIndex - 1]?.focus();
      event.preventDefault();
    }
  };

  useEffect(() => {
    // Установка обработчика событий при монтировании компонента
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Удаление обработчика событий при размонтировании
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Modals
      openModal={!!modal?.product_guid}
      closeModal={closeModal}
      title={modal?.product_name}
    >
      <form className="sendOrder">
        <div className="inputSend">
          <p>Вес</p>
          <input
            value={obj?.ves}
            onChange={() => {}}
            name={"ves"}
            readOnly
            ref={(el) => setRef(el, 0)} // Установка ref с индексом 0
          />
        </div>
        <div className="inputSend">
          <p>Тара</p>
          <input
            value={obj?.tara}
            onChange={() => {}}
            name={"tara"}
            ref={(el) => setRef(el, 1)} // Установка ref с индексом 1
          />
        </div>
        <div className="inputSend">
          <p>Количество</p>
          <input
            value={obj?.count}
            onChange={() => {}}
            name={"count"}
            ref={(el) => setRef(el, 2)} // Установка ref с индексом 2
          />
        </div>
        <div className="btnActions">
          <button onClick={closeModal} ref={(el) => setRef(el, 3)}>
            <p>Отмена</p>
          </button>
          <button className="save" ref={(el) => setRef(el, 4)}>
            <p>Сохранить</p>
          </button>
        </div>
      </form>
    </Modals>
  );
};

export default ModalAddProd;
