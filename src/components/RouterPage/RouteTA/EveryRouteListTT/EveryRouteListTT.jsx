////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// style
import "./style.scss";

////// helpers
import { reverseExtractTimeFromDateTime } from "../../../../helpers/transformDate";

////// fns
import {
  everyRouteCRUD,
  setActiveViewMap,
  setEveryListRouteCRUD,
} from "../../../../store/reducers/mapSlice";

////// imgs
import EditIcon from "../../../../assets/MyIcons/EditIcon";
import DeleteIcon from "../../../../assets/MyIcons/DeleteIcon";
import MapIcon from "../../../../assets/MyIcons/MapIcon";
import ConfirmModal from "../../../../common/ConfirmModal/ConfirmModal";
import { myAlert } from "../../../../helpers/MyAlert";

const EveryRouteListTT = () => {
  const dispatch = useDispatch();

  const { roadRouteEveryTA, everyListRouteCRUD, activeRoute } = useSelector(
    (state) => state.mapSlice
  );

  const [delRoute, setDelRoute] = useState({});

  const openRouteModalCRUD = (actionType, item) => {
    dispatch(setEveryListRouteCRUD({ ...everyListRouteCRUD, actionType }));
    //// открытие модалки для создания оболочки маршрута у ТА

    if (actionType == 2) {
      // редактирование
      const { point_guid, point, guid, start_time, end_time } = item;
      const send = { ...everyListRouteCRUD, ...item, actionType };
      const obj = { seller_select: { value: point_guid, label: point } };
      const times = {
        start_time: reverseExtractTimeFromDateTime(start_time),
        end_time: reverseExtractTimeFromDateTime(end_time),
        route_guid: guid,
      };
      dispatch(setEveryListRouteCRUD({ ...send, ...obj, ...times }));
    }
  };

  const clickCheckBoxForEdit = (e, item) => {
    //// редактирование
    const { point_guid, point, guid } = item;
    const send = { ...everyListRouteCRUD, ...item, actionType: 2 };
    const obj = { seller_select: { value: point_guid, label: point } };
    const checkedObj = { status: e.target.checked ? 1 : 0, route_guid: guid };
    const data = { ...send, ...obj, ...checkedObj, noneAlert: true };
    dispatch(everyRouteCRUD({ ...data, comment: "." }));
  };

  const clickDelRoute = async () => {
    //// удаление
    const { point_guid, point, guid } = delRoute;
    const send = { ...everyListRouteCRUD, ...delRoute, actionType: 3 };
    const obj = { seller_select: { value: point_guid, label: point } };
    const checkedObj = { route_guid: guid, status: -1, comment: "." };
    const data = { ...send, ...obj, ...checkedObj, noneAlert: true };
    const res = await dispatch(everyRouteCRUD(data)).unwrap();
    if (!!res?.result) {
      myAlert("Точка удалена");
      setDelRoute({});
    }
  };

  const editCoordsMap = (item) => {
    const { guid, lat, lon } = item;
    dispatch(setActiveViewMap({ ...item, guid, lat, lon, actionType: 1 }));
    //// открытие модалки
  };

  const openModalAddPoint = () => {
    //// открытие модалки для добавления новой точки
    dispatch(setActiveViewMap({ guid: activeRoute?.guid, actionType: 3 }));
  };

  return (
    <div className="everyRouteListTT">
      <div className="everyRouteListTT__actions">
        <div className="choice">
          <button onClick={() => openRouteModalCRUD(1)}>
            Добавить точку в маршрут
          </button>
          <button className="newPoint" onClick={openModalAddPoint}>
            Добавить новую точку
          </button>
        </div>
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
              <TableCell align="left" style={{ width: "41%" }}>
                Наименование ТТ
              </TableCell>
              <TableCell align="center" style={{ width: "12%" }}>
                Приход
              </TableCell>
              <TableCell align="center" style={{ width: "12%" }}>
                Уход
              </TableCell>
              <TableCell align="center" style={{ width: "10%" }}>
                Статус
              </TableCell>
              <TableCell
                align="center"
                style={{ width: "20%" }}
                className="titleCheckbox"
              >
                *
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roadRouteEveryTA?.map((row) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ width: "5%" }}
                >
                  {row?.ordering}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "41%" }}>
                  {row?.point}
                </TableCell>
                <TableCell align="center" style={{ width: "12%" }}>
                  {row?.start_time}
                </TableCell>
                <TableCell align="center" style={{ width: "12%" }}>
                  {row?.end_time}
                </TableCell>
                <TableCell align="center" style={{ width: "10%" }}>
                  <div className="checkboxTable">
                    <input
                      type="checkbox"
                      onClick={(e) => clickCheckBoxForEdit(e, row)}
                      className="checkboxInner"
                      name="status"
                      checked={!!row?.status}
                    />
                  </div>
                </TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  <div className="actions">
                    <button onClick={() => editCoordsMap(row)}>
                      <MapIcon width={16} height={16} />
                    </button>
                    <button onClick={() => openRouteModalCRUD(2, row)}>
                      <EditIcon width={17} height={17} />
                    </button>
                    <button onClick={(e) => setDelRoute(row)}>
                      <DeleteIcon width={19} height={19} color={"red"} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmModal
        state={delRoute?.guid}
        yesFN={clickDelRoute}
        noFN={() => setDelRoute({})}
        title={"Удалить ?"}
      />
    </div>
  );
};

export default EveryRouteListTT;
