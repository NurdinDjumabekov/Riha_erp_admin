////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

////// components
import MapForChoicePoints from "../MapForChoicePoints/MapForChoicePoints";
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// style
import "./style.scss";

////// helpers
import { transformLists } from "../../../helpers/transformLists";

////// fns
import { setActiveTA } from "../../../store/reducers/selectsSlice";
import {
  ListRouteCRUD,
  getEveryRouteWithTT,
  getListRoute,
  setActiveRoute,
  setCrudRoute,
} from "../../../store/reducers/mapSlice";

////// imgs
import EditIcon from "../../../assets/MyIcons/EditIcon";
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";
import EyesIcon from "../../../assets/MyIcons/EyesIcon";

const EveryRouteTA = () => {
  const dispatch = useDispatch();

  const [lookRoute, setLookRoute] = useState(0);

  const { activeTA } = useSelector((state) => state.selectsSlice);
  const { listTA } = useSelector((state) => state.mainSlice);
  const { listRoadRouteEveryTA, crudRoute, activeRoute } = useSelector(
    (state) => state.mapSlice
  );

  const list_TA = transformLists(listTA, "guid", "fio");

  const onChange = (item) => {
    dispatch(setActiveTA(item));
    dispatch(getListRoute({ agent_guid: item?.guid }));
  };

  useEffect(() => {
    const value = list_TA?.[0]?.guid;
    const label = list_TA?.[0]?.fio;
    dispatch(getListRoute({ agent_guid: value, first: true }));
    dispatch(setActiveTA({ value, label }));
  }, []);

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
    // const bool = e.target.checked;
    // const obj = { ...item, is_active: bool ? 1 : 0, activeTA };
    // const data = { route_sheet_guid: item?.guid };
    // dispatch(ListRouteCRUD({ ...obj, ...data, actionType: 2 }));
    dispatch(setActiveRoute({ guid: item?.guid })); /// активный маршрут для отображения
    dispatch(getEveryRouteWithTT(item?.guid)); /// запрос на получение маршрута
  };

  const clickDelRoute = (item) => {
    //// редактирование
    const obj = { ...item, status: -1 };
    const data = { route_sheet_guid: item?.guid, activeTA };
    dispatch(ListRouteCRUD({ ...obj, ...data, actionType: 3 }));
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

        <button onClick={() => openRouteModalCRUD(1)}>+ Создать</button>
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
              <TableCell style={{ width: "50%" }}>Комментарий</TableCell>
              <TableCell align="left" style={{ width: "20%" }}>
                Дата создания
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
            {listRoadRouteEveryTA?.map((row) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ width: "5%" }}
                >
                  {row?.number}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "50%" }}>
                  {row?.comment}
                </TableCell>
                <TableCell align="left" style={{ width: "20%" }}>
                  {row?.date}
                </TableCell>
                <TableCell align="center" style={{ width: "10%" }}>
                  <div className="checkboxTable">
                    <input
                      type="checkbox"
                      onClick={(e) => clickCheckBoxForEdit(e, row)}
                      className="checkboxInner"
                      name="is_active"
                      // checked={!!row?.is_active}
                      checked={row?.guid == activeRoute?.guid}
                    />
                  </div>
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  <div className="actions">
                    <button onClick={() => openRouteModalCRUD(2, row)}>
                      <EditIcon width={17} height={17} />
                    </button>
                    <button onClick={() => clickDelRoute(row)}>
                      <DeleteIcon width={19} height={19} color={"red"} />
                    </button>
                    <button onClick={() => setLookRoute(row?.number)}>
                      <EyesIcon width={17} height={17} />
                      {lookRoute !== row?.number && (
                        <div className="lineEyes"></div>
                      )}
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

export default EveryRouteTA;
