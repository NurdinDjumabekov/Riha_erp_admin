////// hooks
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
import "./style.scss";

////// components
import SearchShop from "./SearchShop/SearchShop";
import { Tooltip } from "@mui/material";

////// imgs
import user from "../../../assets/images/iAm.jpg";

////// fns
import { getListOrders, listTAfn } from "../../../store/reducers/mainSlice";
import { editListAgents } from "../../../store/reducers/mainSlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";

const MainMenuAgents = (props) => {
  const { mainCheckBox, setMainCheckBox } = props;
  const dispatch = useDispatch();

  const { listTA, activeDate } = useSelector((state) => state.mainSlice);

  const [search, setSearch] = useState("");

  const onChange = (obj) => {
    const error = "Нельзя менять статус тестового агента!";
    if (obj?.guid == "88F8CF21-F5D0-4F55-BC33-B168D739D1D4") {
      return myAlert(error, "error");
    }
    dispatch(editListAgents(obj?.guid));

    const sortList = listTA
      ?.filter((item) => item?.is_checked == 1)
      ?.map((item) => item?.guid);

    if (obj?.is_checked == 0) {
      const agents_guid = [...sortList, obj?.guid];
      dispatch(getListOrders({ ...activeDate, agents_guid }));
    } else {
      const agents_guid = sortList?.filter((guid) => guid !== obj?.guid);
      dispatch(getListOrders({ ...activeDate, agents_guid }));
    }
    /// get обновленный список каждой заявки по часам
  };

  const viewAllApp = () => {
    const newListTA = listTA?.map((i) => {
      return { ...i, is_checked: !mainCheckBox ? 1 : 0 };
    });

    newListTA?.shift();
    const newList = [{ ...listTA?.[0], is_checked: 1 }, ...newListTA];
    dispatch(listTAfn(newList));

    const agents_guid = newList
      ?.filter((item) => item?.is_checked == 1)
      ?.map((item) => item?.guid);

    dispatch(getListOrders({ ...activeDate, agents_guid }));
    /// get обновленный список каждой заявки по часам

    setMainCheckBox(!mainCheckBox);
    //// главый CheckBox на главной страние, при нажатии у всех агентов разом меняются отображения заявок
  };

  const filteredList = listTA?.filter((agent) =>
    agent?.fio?.toLowerCase()?.includes(search?.toLowerCase())
  );
  return (
    <div className="menuLeft">
      <div className="menuLeft__inner">
        <SearchShop search={search} setSearch={setSearch} />
        <div className="title" onClick={viewAllApp}>
          <h2>Торговые агенты</h2>
          <input type="checkbox" checked={mainCheckBox} />
        </div>
        <ul>
          {filteredList?.map((item) => (
            <li key={item?.guid} onClick={() => onChange(item)}>
              <label className="toggle-switch">
                <input type="checkbox" checked={!!item?.is_checked} />
                <span className="slider"></span>
              </label>
              <div className="logo">
                <Tooltip
                  title={
                    <div style={{ borderRadius: "50%" }}>
                      <img
                        src={user}
                        alt="user"
                        style={{ width: 140, height: 140, borderRadius: "50%" }}
                      />
                    </div>
                  }
                  placement="right"
                  disableInteractive
                >
                  <img src={user} alt="user icon" />
                </Tooltip>
              </div>
              <p>{item?.fio}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainMenuAgents;
