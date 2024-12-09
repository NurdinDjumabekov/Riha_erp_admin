////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import SendInput from "../../../../common/SendInput/SendInput";
import Modals from "../../../../common/Modals/Modals";

////// style
import "./style.scss";

////// helpers
import { transformLists } from "../../../../helpers/transformLists";

////// fns
import { setActiveTA } from "../../../../store/reducers/selectsSlice";
import {
  ListRouteCRUD,
  changeRouteSheetTodayReq,
  getEveryRouteWithTT,
  getListRoute,
  getListRoutesForMap,
  getPointsRouteAgent,
  setActiveRoute,
  setRouteCRUD,
} from "../../../../store/reducers/mapSlice";

////// imgs
import EditIcon from "../../../../assets/MyIcons/EditIcon";
import DeleteIcon from "../../../../assets/MyIcons/DeleteIcon";
import MapIcon from "../../../../assets/MyIcons/MapIcon";
import { myAlert } from "../../../../helpers/MyAlert";

const EveryRouteTA = () => {
  const dispatch = useDispatch();

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);
  const { listRoadRouteEveryTA, routeCRUD, activeRoute } = useSelector(
    (state) => state.mapSlice
  );

  const [modal, setModal] = useState({});

  const list_TA = transformLists(listTA, "guid", "fio");

  const onChange = (item) => {
    dispatch(setActiveTA(item));
    dispatch(getListRoute({ agent_guid: item?.guid }));
    /// get список маршрутных листов за 30 зней
    dispatch(getPointsRouteAgent({ guid: item?.guid }));
    /// get список точек за каждый маршрут
  };

  useEffect(() => {
    const value = list_TA?.[0]?.guid;
    const label = list_TA?.[0]?.fio;
    dispatch(getListRoute({ agent_guid: value }));
    /// get список маршрутов за 30 зней
    dispatch(setActiveTA({ value, label })); //// активный ТА
    dispatch(getPointsRouteAgent({ guid: value }));
    /// get список маршрутов за каждый день
  }, []);

  const openRouteModalCRUD = (actionType, data) => {
    dispatch(setRouteCRUD({ ...routeCRUD, actionType }));
    //// открытие модалки для создания оболочки маршрута у ТА

    if (actionType == 2) {
      //// редактирование и удаление
      const send = { ...routeCRUD, ...data, actionType };
      dispatch(setRouteCRUD({ ...send, agent_select: activeTA }));
    }
  };

  const clickCheckBoxForEdit = (e, item) => {
    //// посмотреть более подробный список маршрутов
    dispatch(setActiveRoute({ guid: item?.guid })); /// активный маршрут для отображения
    dispatch(getEveryRouteWithTT(item?.guid)); /// запрос на получение маршрута
  };

  const clickDelRoute = (item) => {
    //// удаление
    const obj = { ...item, status: -1, noneAlert: true };
    const data = { route_sheet_guid: item?.guid, activeTA };
    dispatch(ListRouteCRUD({ ...obj, ...data, actionType: 3 }));
  };

  const lookListRoute = (item) => dispatch(getListRoutesForMap(item?.guid));
  /// get список точек для полного маршрута

  const openModalFN = (e, { guid, is_today }) => {
    if (!!is_today) {
      return myAlert("Этот Маршуртный лист уже активный");
    }
    /// открытие модалки для изменение маршрута на сегодня
    setModal({ ...modal, route_sheet_guid: guid, agent_guid: activeTA?.value });
  };

  const changeRouteSheetToday = async () => {
    /// изменение маршрута на сегодня
    const send = { data: modal, setModal };
    const res = await dispatch(changeRouteSheetTodayReq(send)).unwrap();
    if (res == 1) {
      dispatch(getListRoute({ agent_guid: activeTA?.value }));
      /// get список маршрутных листов за 30 зней
      dispatch(getPointsRouteAgent({ guid: modal?.route_sheet_guid }));
      /// get список точек за каждый маршрут
    }
  };

  return (
    <div className="everyRouteTA">
      <div className="choice">
        <div className="myInputs">
          <Select
            options={list_TA}
            className="select"
            onChange={onChange}
            value={activeTA}
          />
        </div>

        <button onClick={() => openRouteModalCRUD(1)}>+ Создать маршрут</button>
      </div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "100%" }}
        className="scroll_table standartTable"
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: "5%" }}>
                №
              </TableCell>
              <TableCell style={{ width: "40%" }}>Комментарий</TableCell>
              <TableCell align="left" style={{ width: "20%" }}>
                Дата создания
              </TableCell>
              <TableCell align="center" style={{ width: "10%" }}>
                Статус
              </TableCell>
              <TableCell
                align="center"
                style={{ width: "25%" }}
                className="titleCheckbox"
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listRoadRouteEveryTA?.map((row) => (
              <Tooltip
                title={!!row?.is_today && "Активный маршрут на сегодня"}
                placement="top"
              >
                <TableRow
                  key={row?.product_guid}
                  className={!!row?.is_today ? "activeIsToday" : ""}
                >
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    style={{ width: "5%" }}
                    onClick={(e) => clickCheckBoxForEdit(e, row)}
                  >
                    {row?.number}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "40%" }}
                    onClick={(e) => clickCheckBoxForEdit(e, row)}
                  >
                    {row?.comment}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width: "20%" }}
                    onClick={(e) => clickCheckBoxForEdit(e, row)}
                  >
                    {row?.date}
                  </TableCell>
                  <TableCell align="center" style={{ width: "10%" }}>
                    <div className="checkboxTable">
                      <input
                        type="checkbox"
                        onClick={(e) => clickCheckBoxForEdit(e, row)}
                        className="checkboxInner"
                        name="is_active"
                        checked={row?.guid == activeRoute?.guid}
                      />
                    </div>
                  </TableCell>
                  <TableCell align="left" style={{ width: "25%" }}>
                    <div className="actions">
                      <button onClick={() => lookListRoute(row)}>
                        <MapIcon width={16} height={16} />
                      </button>
                      <button onClick={() => openRouteModalCRUD(2, row)}>
                        <EditIcon width={17} height={17} />
                      </button>
                      <button onClick={() => clickDelRoute(row)}>
                        <DeleteIcon width={19} height={19} color={"red"} />
                      </button>
                      <div className="checkboxTable isTodayInput">
                        <input
                          type="checkbox"
                          className="checkboxInner"
                          name="is_active"
                          checked={!!row?.is_today}
                          onClick={(e) => openModalFN(e, row)}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </Tooltip>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modals
        openModal={!!modal?.route_sheet_guid}
        closeModal={() => setModal({})}
        title={`Изменение маршрута для агента`}
      >
        <div className="addTasks__inner">
          <SendInput
            value={modal?.comment}
            onChange={(e) => setModal({ ...modal, comment: e.target.value })}
            title={"Комментарий"}
            name={"comment"}
            typeInput={"textarea"}
          />

          <div className="sendBlock">
            <button onClick={changeRouteSheetToday}> Обновить</button>
          </div>
        </div>
      </Modals>
    </div>
  );
};

export default EveryRouteTA;
