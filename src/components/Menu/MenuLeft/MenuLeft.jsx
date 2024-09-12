////// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// components
import SearchShop from "./SearchShop/SearchShop";
import { FormControlLabel, Switch, styled } from "@mui/material";

////// imgs
import plus from "../../../assets/icons/plus-square.svg";
import minus from "../../../assets/icons/minus-square.svg";

////// fns
import { getListOrders } from "../../../store/reducers/mainSlice";
import { editListAgents } from "../../../store/reducers/mainSlice";
import { searchActiveOrdersTA } from "../../../helpers/searchActiveOrdersTA";

const Android12Switch = styled(Switch)(() => ({
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
  },

  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 12,
    height: 12,
    margin: 5,
    marginTop: 4,
    background: "#fff",
  },
}));

const MenuLeft = () => {
  const dispatch = useDispatch();

  const { listTA, activeDate } = useSelector((state) => state.mainSlice);

  const [look, setLook] = useState(true);
  const [checked, setChecked] = useState(true);

  const onChange = (e, guid) => {
    dispatch(editListAgents(guid));
    setChecked(!checked);
  };

  useEffect(() => {
    const agents_guid = searchActiveOrdersTA(listTA);
    dispatch(getListOrders({ ...activeDate, agents_guid }));
    /// get обновленный список каждой заявки по часам
  }, [checked]);

  return (
    <div className="menuLeft">
      <div className="menuLeft__inner">
        <SearchShop />
        <div className="title" onClick={() => setLook(!look)}>
          <h2>Торговые агенты</h2>
          <button>
            <img src={look ? minus : plus} alt="-" />
          </button>
        </div>
        <ul className={`content ${look ? "show" : ""}`}>
          {listTA?.map((item) => (
            <li key={item?.guid}>
              <FormControlLabel
                control={<Android12Switch />}
                label={item?.fio}
                checked={!!item?.is_checked}
                onChange={(e) => onChange(e, item?.guid)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuLeft;
