import React from "react";
import { useEffect } from "react";
import { getMyInvoice } from "../../store/reducers/invoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { roundingNum } from "../../helpers/totals";

////// style
import "./style.scss";

////// imgs
import arrow from "../../assets/icons/arrowLeft.svg";
import EveryInvoiceModal from "../../components/MyInvoicePage/Modals/EveryInvoiceModal/EveryInvoiceModal";
import ArrowNav from "@mui/icons-material/ArrowForwardIosSharp";

////// fns
import { setInvoiceInfo } from "../../store/reducers/mainSlice";

const MyInvoicePage = () => {
  const dispatch = useDispatch();

  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { listInvoice } = useSelector((state) => state.invoiceSlice);

  useEffect(() => {
    dispatch(getMyInvoice(dataSave?.guid));
  }, []);

  const clickSeller = ({ invoice_guid }, index) => {
    dispatch(setInvoiceInfo({ guid: invoice_guid, action: 8, index }));
  };

  const objType = {
    0: { text: "На складе", color: "red" },
    1: { text: "Отгружено", color: "red" },
    2: { text: "Принято", color: "green" },
  };

  if (listInvoice?.length == 0) {
    return (
      <div className="emptyData">
        <p>Список пустой</p>
      </div>
    );
  }

  return (
    <>
      <div className="navAction">
        <p>Список принятых накладных</p>
        <ArrowNav sx={{ color: "#fff" }} />
      </div>
      <div className="myInvoicePage">
        {listInvoice?.map((item, index) => (
          <button
            className="invoiceParent"
            onClick={() => clickSeller(item, index + 1)}
          >
            <div className="invoiceParent__inner">
              <div className="mainData">
                <p className="indexNums">{index + 1}</p>
                <div>
                  <p className="titleDate role">{item?.user_create}</p>
                  <p className="titleDate">{item.date}</p>
                </div>
              </div>
              {!!item?.comment ? (
                <p className="comments">{item.comment}</p>
              ) : (
                <p className="comments"> ...</p>
              )}
            </div>
            <div className="mainDataArrow">
              <div>
                <p style={{ color: objType?.[item?.status]?.color }}>
                  {objType?.[item?.status]?.text}
                </p>
                <span className="totalPrice">
                  {roundingNum(item?.total_price, 2)} сом
                </span>
              </div>
              <div className="arrows">
                <ArrowNav sx={{ color: "rgba(162, 178, 238, 0.839)" }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <EveryInvoiceModal />
    </>
  );
};

export default MyInvoicePage;
