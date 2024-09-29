import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInvoice } from "../../store/reducers/invoiceSlice";
import { useDispatch, useSelector } from "react-redux";

////// helpers
import { roundingNum } from "../../helpers/totals";

////// style
import "./style.scss";

////// imgs
import EveryInvoiceModal from "../../components/MyInvoicePage/Modals/EveryInvoiceModal/EveryInvoiceModal";
import ArrowNav from "@mui/icons-material/ArrowForwardIosSharp";

////// fns
import { setInvoiceInfo } from "../../store/reducers/mainSlice";

const MyInvoicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <div className="navAction" onClick={() => navigate("/accept_invoice")}>
        <p>Список принятых накладных</p>
        <ArrowNav sx={{ color: "#fff" }} />
      </div>

      {listInvoice?.length == 0 ? (
        <div className="emptyData">
          <p>Список пустой</p>
        </div>
      ) : (
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
      )}

      <EveryInvoiceModal />
    </>
  );
};

export default MyInvoicePage;
