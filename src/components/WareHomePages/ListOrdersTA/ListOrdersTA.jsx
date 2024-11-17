////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// fns
import {
  activeOrderFN,
  activeSortFN,
  getListOrdersWH_Req,
} from "../../../store/reducers/wareHouseSlice";

////// icons
import arrowIcon from "../../../assets/icons/arrowSort.svg";

////// style
import "./style.scss";

const ListOrdersTA = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location?.pathname == "/ware_home", "location");

  const { listOrdersTA } = useSelector((state) => state.wareHouseSlice);
  const { activeOrder } = useSelector((state) => state.wareHouseSlice);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (location?.pathname != "/ware_home") {
        return;
      }
      const currentIndex = listOrdersTA?.findIndex(
        (item) => item?.guid == activeOrder?.guid
      );
      if (
        event.key === "ArrowDown" &&
        currentIndex < listOrdersTA?.length - 1
      ) {
        dispatch(activeOrderFN(listOrdersTA?.[currentIndex + 1]));
      }
      if (event.key === "ArrowUp" && currentIndex > 0) {
        dispatch(activeOrderFN(listOrdersTA?.[currentIndex - 1]));
      }
      if (event.key === "Enter") {
        enterClick(activeOrder);
      }
      if (event.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [listOrdersTA, activeOrder]);

  const enterClick = (obj) => {
    dispatch(activeOrderFN(obj));
    navigate("/ware_home/orders", { state: obj });
  };

  const sortBtn = (codeid) => {
    dispatch(activeSortFN(codeid));
    dispatch(getListOrdersWH_Req(codeid)).unwrap();
  };

  return (
    <div className="listOrdersTA">
      <div className="headerSort">
        <h6>Список заявок торговых агентов</h6>
      </div>
      <div className="listOrdersTA__inner">
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
                <TableCell
                  align="left"
                  style={{ width: "10%" }}
                  onClick={() => sortBtn(3)}
                >
                  На дату
                  <img src={arrowIcon} alt=">" />
                </TableCell>
                <TableCell
                  align="left"
                  style={{ width: "30%" }}
                  onClick={() => sortBtn(1)}
                >
                  Агент
                  <img src={arrowIcon} alt=">" />
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Заявка
                </TableCell>
                <TableCell
                  align="left"
                  style={{ width: "15%" }}
                  onClick={() => sortBtn(2)}
                >
                  Статус отгрузки
                  <img src={arrowIcon} alt=">" />
                </TableCell>
                <TableCell align="left" style={{ width: "25%" }}>
                  Коммент
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listOrdersTA?.map((row, index) => (
                <TableRow
                  key={`${row?.guid}${index}`}
                  className={row?.guid == activeOrder?.guid ? "activeGuid" : ""}
                  onClick={() => enterClick(row)}
                >
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    style={{ width: "5%" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "10%" }}
                  >
                    {row?.date}
                  </TableCell>
                  <TableCell align="left" style={{ width: "30%" }}>
                    {row?.fio}
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    № {row?.codeid}
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.status_date}
                  </TableCell>
                  <TableCell align="left" style={{ width: "25%" }}>
                    {row?.comment || "..."}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListOrdersTA;
