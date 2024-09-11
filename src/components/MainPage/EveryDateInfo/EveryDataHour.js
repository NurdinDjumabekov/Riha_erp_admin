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
import {
  setCheckInvoice,
  setInvoiceInfo,
} from "../../../store/reducers/requestSlice";
import { getListProdsInInvoice } from "../../../store/reducers/requestSlice";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 300,
    maxHeight: 500,
    // overflow: "scroll",
    // backgroundColor: "#fff", // Задаем цвет фона
    // color: "#222",
    padding: 10,
  },
  "& p": {
    fontSize: "12px",
    margin: "5px 0",
  },
});

const EveryDataHour = ({ content }) => {
  const { status, agent, invoice_guid } = content?.event?._def?.extendedProps;
  const { total_price } = content?.event?._def?.extendedProps;

  const dispatch = useDispatch();

  const editEveryInvoice = () => {
    ///// редактирвоание заявки ( action: 2)
    dispatch(setInvoiceInfo({ guid: invoice_guid, action: 2 }));
    dispatch(getListProdsInInvoice(invoice_guid));

    ///// можно ли редактировать данные

    if (status == 0) {
      dispatch(setCheckInvoice(true));
    } else {
      dispatch(setCheckInvoice(false));
    }
  };

  return (
    <div className="everyOrder" onClick={editEveryInvoice}>
      {/* <CustomWidthTooltip
        disableInteractive
        title={
          <div className="moreInfoOrders">
            <p>{texts}</p>
          </div>
        }
        placement="top"
        arrow
      > */}
      <div className="everyOrder__inner">
        <h6>{agent}</h6>
        <p className="name">{total_price} сом</p>
        <div className="status">
          <Tooltip
            title={objStatusOrders?.[status]?.text}
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
              {objStatusOrders?.[status]?.img}
            </div>
          </Tooltip>
        </div>
      </div>
      {/* </CustomWidthTooltip> */}
    </div>
  );
};

export default EveryDataHour;
