/////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";

////// components
import Modals from "../../../common/Modals/Modals";

////// fns
import { getEveryOrderTA } from "../../../store/reducers/wareHouseSlice";
import { addProdInInvoiceReq } from "../../../store/reducers/wareHouseSlice";

///// style
import "./style.scss";

const ModalAddProd = (props) => {
  const { closeModal, modal, state } = props;

  const dispatch = useDispatch();
  const [obj, setObj] = useState({});
  const inputRefs = useRef([]);
  const objRef = useRef(obj);

  useEffect(() => {
    objRef.current = obj;
  }, [obj]);

  const setRef = (el, index) => {
    inputRefs.current[index] = el;
  };

  const addProdInOrder = async () => {
    const send = {
      invoice_guid: modal?.invoice_guid,
      products: [
        {
          product_guid: modal?.product_guid,
          count: objRef.current.count || 0,
          workshop_price: modal?.price,
          count_kg: objRef.current.ves || 0,
          tara: objRef.current.tara || 0,
        },
      ],
      comment: "",
    };

    if (!!objRef.current.count) {
      const res = await dispatch(addProdInInvoiceReq(send)).unwrap();
      if (res?.result == 1) {
        dispatch(getEveryOrderTA(state?.agent_guid));
        closeModal();
        setObj({});
      }
    } else {
      closeModal();
      setObj({});
    }
  };

  const handleKeyDown = (event) => {
    if (!!!modal?.product_guid) {
      return;
    }

    const currentIndex = inputRefs.current.findIndex(
      (ref) => ref === document.activeElement
    );

    if (
      event.key === "ArrowDown" &&
      currentIndex < inputRefs.current.length - 1
    ) {
      inputRefs.current[currentIndex + 1]?.focus();
      event.preventDefault();
    }

    if (event.key === "ArrowUp" && currentIndex > 0) {
      inputRefs.current[currentIndex - 1]?.focus();
      event.preventDefault();
    }

    if (
      event.key === "ArrowRight" &&
      currentIndex < inputRefs.current.length - 1
    ) {
      inputRefs.current[currentIndex + 1]?.focus();
      event.preventDefault();
    }

    if (event.key === "ArrowLeft" && currentIndex > 0) {
      inputRefs.current[currentIndex - 1]?.focus();
      event.preventDefault();
    }

    if (
      event.key === "Enter" &&
      document.activeElement !== inputRefs.current?.[2]
      // inputRefs.current[2] — это кнопка "Отмена"
    ) {
      addProdInOrder();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal?.product_guid]);

  useEffect(() => {
    if (!!modal?.product_guid && inputRefs.current[1]) {
      setTimeout(() => {
        inputRefs.current[1]?.focus();
      }, 100);
    }
  }, [modal?.product_guid]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setObj((prevObj) => ({
      ...prevObj,
      [name]: value,
    }));
  };

  return (
    <Modals
      openModal={!!modal?.product_guid}
      closeModal={closeModal}
      title={modal?.product_name}
    >
      <div className="sendOrder">
        <div className="inputSend">
          <p>Вес</p>
          <input value={obj?.ves} onChange={onChange} name={"ves"} readOnly />
        </div>
        <div className="inputSend">
          <p>Тара</p>
          <input
            type="number"
            value={obj?.tara}
            onChange={onChange}
            name={"tara"}
            ref={(el) => setRef(el, 0)}
          />
        </div>
        <div className="inputSend">
          <p>Количество</p>
          <input
            type="number"
            value={obj?.count}
            onChange={onChange}
            name={"count"}
            ref={(el) => setRef(el, 1)}
          />
        </div>
        <div className="btnActions">
          <button
            onClick={closeModal}
            ref={(el) => setRef(el, 2)}
            type="button"
          >
            <p>Отмена</p>
          </button>
          <button
            className="save"
            ref={(el) => setRef(el, 3)}
            type="button"
            onClick={addProdInOrder}
          >
            <p>Сохранить</p>
          </button>
        </div>
      </div>
    </Modals>
  );
};

export default ModalAddProd;
