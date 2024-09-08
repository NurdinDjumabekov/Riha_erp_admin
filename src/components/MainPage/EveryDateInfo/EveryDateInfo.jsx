/////// hooks
import React from "react";

/////// style
import "./style.scss";
import { styled } from "@mui/styles";

/////// icons

////// components
import { Tooltip, tooltipClasses } from "@mui/material";

////// helpers
import { objStatusOrders } from "../../../helpers/objs";
import { texts } from "../../../helpers/LocalData";

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

const EveryDateInfo = (content) => {
  const { status, agent } = content.event._def.extendedProps;
  const { total_price } = content.event._def.extendedProps;

  return (
    <div className="everyOrder">
      <CustomWidthTooltip
        title={
          <div className="moreInfoOrders">
            <p>{texts}</p>
          </div>
        }
        placement="top"
        arrow
      >
        <div className="everyOrder__inner">
          <h6>{agent}</h6>
          <p className="name">{total_price} сом</p>
          <div className="status">
            <Tooltip
              title={objStatusOrders?.[status]?.text}
              placement="right-start"
            >
              <div className="status__inner">
                {objStatusOrders?.[status]?.img}
              </div>
            </Tooltip>
          </div>
        </div>
      </CustomWidthTooltip>
    </div>
  );
};

export default EveryDateInfo;
