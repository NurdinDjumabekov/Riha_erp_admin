/////// hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";
import { styled } from "@mui/styles";

////// components
import { Tooltip, tooltipClasses } from "@mui/material";

////// helpers
import { objStatusOrders } from "../../../helpers/objs";

/////// fns
import { setInvoiceGuid } from "../../../store/reducers/requestSlice";
import { getEveryIngredient } from "../../../store/reducers/requestSlice";
import { searchActiveOrdersTA } from "../../../helpers/searchActiveOrdersTA";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 300,
    maxHeight: 500,
    padding: 10,
  },
  "& p": {
    fontSize: "12px",
    margin: "5px 0",
  },
});

const EveryDataDay = ({ content }) => {
  const { status, agents_counts } = content?.event?._def?.extendedProps;
  const { total_sum, total_count } = content?.event?._def?.extendedProps;
  const { invoice_guid, date_from } = content?.event?._def?.extendedProps;
  const { list_ingredient } = content?.event?._def?.extendedProps;

  const { listTA, activeDate } = useSelector((state) => state.requestSlice);
  const { invoiceGuid } = useSelector((state) => state.requestSlice);

  // console.log(content?.event?._def?.extendedProps, "content");
  console.log(list_ingredient, "list_ingredient");

  const dispatch = useDispatch();

  const readAllInvoiceEveryDay = () => {
    console.log(content, "content");
    ///// просмотр всех ингредиентов ( action: 3)
    dispatch(setInvoiceGuid({ guid: invoice_guid, action: 3 }));

    const agents_guid = searchActiveOrdersTA(listTA);
    const data = { agents_guid, date_from, date_to: date_from };
    dispatch(getEveryIngredient(data));
  };

  return (
    <div className="everyOrder day" onClick={readAllInvoiceEveryDay}>
      <CustomWidthTooltip
        title={
          <ul
            className="moreInfoOrders"
            style={{ maxHeight: 145, overflow: "hidden" }}
          >
            {list_ingredient?.map((i) => (
              <p>
                {i?.name}, {i?.amount}
                {i?.unit_name}, {i?.total_price} сом
              </p>
            ))}
          </ul>
        }
        placement="top"
        arrow
      >
        <div className="everyOrder__inner">
          <h6>Кол-во агентов: {agents_counts}</h6>
          <p className="name">Сумма: {total_sum} сом</p>
          <p className="name">Общее кол-во: {total_count} шт</p>
          <div className="status">
            <Tooltip
              title={objStatusOrders?.[status]?.text}
              placement="right-start"
              slotProps={{
                popper: {
                  modifiers: [{ name: "offset", options: { offset: [0, -8] } }],
                },
              }}
            ></Tooltip>
          </div>
        </div>
      </CustomWidthTooltip>
    </div>
  );
};

export default EveryDataDay;
