import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modals from "../../../common/Modals/Modals";
import {
  addProdInInvoiceReq,
  getEveryOrderTA,
} from "../../../store/reducers/wareHouseSlice";
import "./style.scss";

const ModalAddProd = (props) => {
  const { closeModal, modal, state } = props;

  const dispatch = useDispatch();
  const [obj, setObj] = useState({});
  const inputRefs = useRef([]);

  const setRef = (el, index) => {
    inputRefs.current[index] = el;
  };

  const addProdInOrder = async () => {
    console.log("asdasd");
    const send = {
      invoice_guid: modal?.invoice_guid,
      products: [
        {
          product_guid: modal?.product_guid,
          count: obj?.count || 0,
          workshop_price: modal?.price,
          count_kg: obj?.ves || 0,
          tara: obj?.tara || 0,
        },
      ],
      comment: "",
    };
    const res = await dispatch(addProdInInvoiceReq(send)).unwrap();
    console.log(res);
    if (res?.result == 1) {
      dispatch(getEveryOrderTA(state?.guid));
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

    if (event.key === "Enter") {
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
      }, 300);
    }
  }, [modal?.product_guid]);

  const onChange = (e) => setObj({ ...obj, [e.target.name]: e.target.value });

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
