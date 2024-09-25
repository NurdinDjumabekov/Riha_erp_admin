/////// hooks
import React from "react";
import { useDispatch } from "react-redux";

/////// style
import "./style.scss";
import { styled } from "@mui/styles";

/////// icons

////// components
import { Tooltip, tooltipClasses } from "@mui/material";

////// helpers
import { objStatusOrders } from "../../../helpers/objs";
import { texts } from "../../../helpers/LocalData";

/////// fns
import { setInvoiceInfo } from "../../../store/reducers/mainSlice";
import { setCheckInvoice } from "../../../store/reducers/mainSlice";
import { getListProdsInInvoice } from "../../../store/reducers/mainSlice";

////// icons
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const EveryDataHour = ({ content }) => {
  const { status, agent, invoice_guid } = content?.event?._def?.extendedProps;
  const { total_price, codeid } = content?.event?._def?.extendedProps;

  const dispatch = useDispatch();

  const editEveryInvoice = () => {
    ///// редактирвоание заявки ( action: 2)
    dispatch(setInvoiceInfo({ guid: invoice_guid, action: 2 }));
    dispatch(getListProdsInInvoice(invoice_guid));

    ///// можно ли редактировать данные

    // if (status == 0) {
    //   dispatch(setCheckInvoice(true));
    // } else {
    //   dispatch(setCheckInvoice(false));
    // }
  };

  return (
    <div className="everyOrder" onClick={editEveryInvoice}>
      <div className="everyOrder__inner">
        <h6>№ {codeid}</h6>
        <h5>{agent}</h5>
        <p className="name">{total_price} с</p>
        {/* <div className="status">
          <Tooltip
            title={objStatusOrders?.[status]?.text || "Заявка будет обработана"}
            placement="top"
            arrow
            disableInteractive
            slotProps={{
              popper: {
                modifiers: [{ name: "offset", options: { offset: [0, -1] } }],
              },
            }}
          >
            <div className="status__inner">
              {objStatusOrders?.[+status]?.img || (
                <HelpOutlineIcon sx={{ color: "#222" }} />
              )}
            </div>
            <p></p>
          </Tooltip>
        </div> */}
      </div>
    </div>
  );
};

export default EveryDataHour;
