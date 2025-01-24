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
import {
  getListOrders,
  getListTA,
  listTAfn,
  mainActiveCheckBoxTA_FN,
} from "../../../store/reducers/mainSlice";
import { editListAgents } from "../../../store/reducers/mainSlice";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";

const MenuLeft = () => {
  const dispatch = useDispatch();

  const { listTA, activeDate } = useSelector((state) => state.mainSlice);
  const { mainActiveCheckBoxTA } = useSelector((state) => state.mainSlice);
  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);

  const [search, setSearch] = useState("");

  const onChange = (obj, index) => {
    const error = "Нельзя менять статус тестового агента!";
    if (index == 0) return myAlert(error, "error");
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
      return { ...i, is_checked: !mainActiveCheckBoxTA ? 1 : 0 };
    });

    newListTA?.shift();
    const newList = [{ ...listTA?.[0], is_checked: 1 }, ...newListTA];
    dispatch(listTAfn(newList));

    const agents_guid = newList
      ?.filter((item) => item?.is_checked == 1)
      ?.map((item) => item?.guid);

    dispatch(getListOrders({ ...activeDate, agents_guid }));
    /// get обновленный список каждой заявки по часам

    dispatch(mainActiveCheckBoxTA_FN(!mainActiveCheckBoxTA));
    //// главый CheckBox на главной страние, при нажатии у всех агентов разом меняются отображения заявок
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await dispatch(getListTA({ guid, first: true })).unwrap();
    const newList = res?.filter((item) => {
      if (item?.is_checked == 1) {
        return item;
      }
    });
    dispatch(mainActiveCheckBoxTA_FN(newList?.length > 7 ? true : false));
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
          <input type="checkbox" checked={mainActiveCheckBoxTA} />
        </div>
        <ul>
          {filteredList?.map((item, index) => (
            <li key={item?.guid} onClick={() => onChange(item, index)}>
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

export default MenuLeft;
