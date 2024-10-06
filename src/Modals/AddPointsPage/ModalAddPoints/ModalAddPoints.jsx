import React from "react";
import Modals from "../../../components/Modals/Modals";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewPonts,
  clearInfoNewPoint,
  setInfoNewPoint,
} from "../../../store/reducers/pointsSlice";
import SendInput from "../../../common/SendInput/SendInput";
import NumberInput from "../../../common/NumberInput/NumberInput";
import { myAlert } from "../../../helpers/MyAlert";
import { checkNum } from "../../../helpers/validations";

const ModalAddPoints = () => {
  const dispatch = useDispatch();
  const { infoNewPoint } = useSelector((state) => state.pointsSlice);

  const onChange = ({ target: { name, value } }) => {
    if (name === "inn" && value.length > 14) return;

    dispatch(setInfoNewPoint({ ...infoNewPoint, [name]: value }));
  };

  const createNewPonts = () => {
    if (!!!infoNewPoint?.name || !!!infoNewPoint?.address) {
      myAlert("Заполните поля 'ФИО продавца' и 'Адрес точки' ", "error");
      return;
    }

    if (infoNewPoint?.inn?.length !== 14) {
      myAlert("Заполните правильно поле 'ИНН' ", "error");
      return;
    }

    if (checkNum(infoNewPoint?.phone)) {
      myAlert("Заполните правильно поле 'Номер продавца'", "error");
      return;
    }

    // if (!!!infoNewPoint?.name_owner) {
    //   const text = "Заполните поле 'ФИО хозяина точки' ";
    //   myAlert(text, "error");
    //   return;
    // }

    // if (checkNum(infoNewPoint?.number_owner)) {
    //   myAlert("Заполните правильно поле Номер хозяина точки'", "error");
    //   return;
    // }

    dispatch(addNewPonts(infoNewPoint));
  };

  console.log(infoNewPoint);

  const closeModal = () => dispatch(clearInfoNewPoint());

  return (
    <div>
      <Modals
        openModal={!!infoNewPoint?.codeid}
        closeModal={closeModal}
        title={"Регистрация точки"}
      >
        <div className="createPay">
          <SendInput
            value={infoNewPoint?.name}
            onChange={onChange}
            title={"ФИО продавца"}
            name={"name"}
          />

          <SendInput
            value={infoNewPoint?.address}
            onChange={onChange}
            title={"Адрес точки"}
            name={"address"}
            type="text"
          />

          <NumberInput
            value={infoNewPoint?.phone}
            onChange={onChange}
            title={"Номер продавца"}
            name={"phone"}
          />

          <SendInput
            value={infoNewPoint?.inn}
            onChange={onChange}
            title={"ИНН"}
            name={"inn"}
            type="number"
          />

          <SendInput
            value={infoNewPoint?.name_owner}
            onChange={onChange}
            title={"ФИО хозяина точки"}
            name={"name_owner"}
          />

          <NumberInput
            value={infoNewPoint?.number_owner}
            onChange={onChange}
            title={"Номер хозяина точки"}
            name={"number_owner"}
          />

          <button className="sendData" onClick={createNewPonts}>
            Добавить
          </button>
        </div>
      </Modals>
    </div>
  );
};

export default ModalAddPoints;
