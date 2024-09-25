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

////// fns
import { ListRouteCRUD, setCrudRoute } from "../../../store/reducers/mapSlice";

////// imgs
import EditIcon from "../../../assets/MyIcons/EditIcon";
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";
import EyesIcon from "../../../assets/MyIcons/EyesIcon";

const EveryRouteListTT = () => {
  const dispatch = useDispatch();

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);
  const { crudRoute, roadRouteEveryTA } = useSelector(
    (state) => state.mapSlice
  );

  const openRouteModalCRUD = (actionType, data) => {
    dispatch(setCrudRoute({ ...crudRoute, actionType }));
    //// открытие модалки для создания оболочки маршрута у ТА

    if (actionType == 2) {
      //// редактирование и удаление
      const send = { ...crudRoute, ...data, actionType };
      dispatch(setCrudRoute({ ...send, agent_select: activeTA }));
    }
  };

  const clickCheckBoxForEdit = (e, item) => {
    //// редактирование
    const bool = e.target.checked;
    const obj = { ...item, is_active: bool ? 1 : 0, activeTA };
    const data = { route_sheet_guid: item?.guid };
    dispatch(ListRouteCRUD({ ...obj, ...data, actionType: 2 }));
  };

  const clickDelRoute = (item) => {
    //// редактирование
    const obj = { ...item, status: -1 };
    const data = { route_sheet_guid: item?.guid, activeTA };
    dispatch(ListRouteCRUD({ ...obj, ...data, actionType: 3 }));
  };

  return (
    <div className="everyRouteListTT">
      <div className="choice">
        <button onClick={() => openRouteModalCRUD(1)}>+ Добавить</button>
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
              <TableCell align="left" style={{ width: "30%" }}>
                Наименование ТТ
              </TableCell>
              <TableCell align="center" style={{ width: "15%" }}>
                Приход
              </TableCell>
              <TableCell align="center" style={{ width: "15%" }}>
                Уход
              </TableCell>
              <TableCell align="center" style={{ width: "10%" }}>
                Координаты
              </TableCell>
              <TableCell align="center" style={{ width: "10%" }}>
                Статус
              </TableCell>
              <TableCell
                align="center"
                style={{ width: "15%" }}
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
                <TableCell component="th" scope="row" style={{ width: "30%" }}>
                  {row?.point}
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>
                  {row?.start_time}
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>
                  {row?.end_time}
                </TableCell>
                <TableCell align="center" style={{ width: "15%" }}>
                  {row?.end_time}
                </TableCell>
                <TableCell align="center" style={{ width: "10%" }}>
                  <div className="checkboxTable">
                    <input
                      type="checkbox"
                      onClick={(e) => clickCheckBoxForEdit(e, row)}
                      className="checkboxInner"
                      name="is_active"
                      checked={!!row?.is_active}
                    />
                  </div>
                </TableCell>
                <TableCell align="left" style={{ width: "10%" }}>
                  <div className="actions">
                    <button onClick={() => openRouteModalCRUD(2, row)}>
                      <EditIcon width={17} height={17} />
                    </button>
                    <button onClick={(e) => clickDelRoute(row)}>
                      <DeleteIcon width={19} height={19} color={"red"} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EveryRouteListTT;
