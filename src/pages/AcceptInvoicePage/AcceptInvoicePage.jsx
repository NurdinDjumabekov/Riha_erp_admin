//////// hooks
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

////// fns
import { historyAcceptInvoice } from "../../store/reducers/invoiceSlice";

////// icons
import ArrowNav from "@mui/icons-material/ArrowForwardIosSharp";

////// helpers
import { listAcceptInvoiceTem } from "../../helpers/objs";
import { roundingNum } from "../../helpers/totals";

////// style
import "./style.scss";

const AcceptInvoicePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataSave } = useSelector((state) => state.saveDataSlice);

  useEffect(() => {
    // История принятых накладных ТА в виде PDF
    dispatch(historyAcceptInvoice({ agent_guid: dataSave?.guid }));
  }, [dispatch, dataSave?.guid]);

  const clickInvoice = ({ file }) => {
    const encodedFile = encodeURIComponent(file); // Кодирование URL
    navigate(`/view/${encodedFile}`);
  };

  return (
    <div className="acceptInvoicePage">
      {listAcceptInvoiceTem?.map((item) => (
        <button
          key={item?.codeid}
          className="invoiceParent"
          onClick={() => clickInvoice(item)}
        >
          <div className="invoiceParent__inner">
            <div className="mainData">
              <p className="indexNums">{item?.codeid}</p>
              <div>
                <p className="titleDate role">{item?.sender}</p>
                <p className="titleDate">{item?.date_create}</p>
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
              <p style={{ color: "green" }}>Принято</p>
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
  );
};

export default AcceptInvoicePage;
