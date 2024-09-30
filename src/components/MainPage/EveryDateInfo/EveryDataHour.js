/////// hooks
import React from "react";
import { useDispatch } from "react-redux";

/////// style
import "./style.scss";
import { styled } from "@mui/styles";

/////// img

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
import UserIcon from "@mui/icons-material/AccountCircle";
import PaidIcon from "@mui/icons-material/PaymentsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

////// imgs
import imgInfo from "../../../assets/images/design-process.png";
import ScheduleSendOutlinedIcon from "@mui/icons-material/ScheduleSendOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

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
    <div
      className={`everyOrder ${status == 3 ? "deActive" : ""}`}
      onClick={editEveryInvoice}
    >
      <div className="everyOrder__inner hourTitle">
        <h6>№ {codeid}</h6>
        <h5 className="titleHour">
          <UserIcon />
          {agent}
          <div className="status">
            <Tooltip
              title={
                objStatusOrders?.[status]?.text ||
                "Заявка скоро будет обработана"
              }
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
                {objStatusOrders?.[status]?.icon}
              </div>
              <p></p>
            </Tooltip>
          </div>
        </h5>
        <p className="name">
          <PaidIcon />
          {total_price} с
        </p>
      </div>
    </div>
  );
};

export default EveryDataHour;
