//// style
import { useEffect } from "react";
import Modals from "../Modals/Modals";
import "./style.scss";

const MyConfirmModal = ({ visible, message, onYes, onNo, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (!!visible) {
          onYes();
        }
      }
      if (event.key === "Escape") {
        if (!!visible) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  return (
    <Modals
      openModal={visible}
      setOpenModal={onClose}
      title={""}
      closeModal={onClose}
    >
      <div onClick={onClose}>
        <div className="parentConf">
          <div className="containerActions">
            <h6>{message}</h6>
            <div className="buttonContainer">
              <button onClick={onYes} className="btnsGood">
                Да
              </button>
              <div onClick={onNo} className="btnsNoo">
                Нет
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modals>
  );
};

export default MyConfirmModal;
