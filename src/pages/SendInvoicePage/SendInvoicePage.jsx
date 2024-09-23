///// hooks
import React from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// imgs
import photos from "../../assets/images/iAm.jpg";

////// components
import ModalCreateInvoice from "../../components/SendInvoicePage/Modals/ModalCreateInvoice/ModalCreateInvoice";

/////// fns
import { createInvoiceSendTT } from "../../store/reducers/invoiceSlice";

const SendInvoicePage = () => {
  const dispatch = useDispatch();

  const { listPointsEveryTA } = useSelector((state) => state.mapSlice);
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  const clickSeller = ({ guid }) => {
    const data = {
      sender_guid: dataSave?.guid, // guid отправителя
      sender_type: dataSave?.user_type, // 1
      reciever_guid: guid, // guid получателя
      reciever_type: 4, // type продавца
      user_guid: dataSave?.guid, // guid человека кто создает
      user_type: dataSave?.user_type, // 1
    };
    dispatch(createInvoiceSendTT({ data, seller_guid: guid }));
  };

  return (
    <>
      <ul className="sendAppPage">
        {listPointsEveryTA?.map((item) => (
          <li className="sendAppPage__every" onClick={() => clickSeller(item)}>
            <div className="photo">
              <img src={item?.sellers?.[0]?.photo || photos} alt="photos" />
            </div>
            <div className="mainContent">
              <h6>{item?.text}</h6>
              <p>{item?.sellers?.[0]?.seller_fio}</p>
              {!!!item?.sellers?.[0]?.is_active && (
                <div className="status"></div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <ModalCreateInvoice />
    </>
  );
};

export default SendInvoicePage;
