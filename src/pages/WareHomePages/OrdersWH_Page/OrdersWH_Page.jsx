////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import ModalAddProd from "../../../components/WareHomePages/ModalAddProd/ModalAddProd";

////// fns
import { getEveryOrderTA } from "../../../store/reducers/wareHouseSlice";

////// icons

////// style
import "./style.scss";

const OrdersWH_Page = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [active, setActive] = useState({});
  const [modal, setModal] = useState({});

  const { listProdsEveryOrder } = useSelector((state) => state.wareHouseSlice);

  const getData = async () => {
    const res = await dispatch(getEveryOrderTA(state?.guid)).unwrap();
    /// get список заказов от ТА для отпуска
    setActive(res?.[0] || {});
  };

  useEffect(() => {
    getData();
  }, [state?.guid]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!!modal?.product_guid || listProdsEveryOrder?.length === 0) {
        if (event.key === "Escape") {
          closeModal();
        }
        return;
      }

      const index = listProdsEveryOrder?.findIndex(
        (item) => item?.product_guid == active?.product_guid
      );

      if (
        event.key === "ArrowDown" &&
        index < listProdsEveryOrder?.length - 1
      ) {
        setActive(listProdsEveryOrder?.[index + 1]);
      }
      if (event.key === "ArrowUp" && index > 0) {
        setActive(listProdsEveryOrder?.[index - 1]);
      }
      if (event.key === "Enter") {
        enterClick(active);
      }
      if (event.key === "Escape") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [listProdsEveryOrder, active, modal?.product_guid]);

  const enterClick = (obj) => {
    setActive(obj);
    setModal(obj);
  };

  const closeModal = () => setModal({});

  return (
    <div className="ordersWH">
      <div className="headerSort">
        <h6>Заявки торгового агента: {state?.fio}</h6>
      </div>
      <div className="ordersWH__inner">
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
                <TableCell align="left" style={{ width: "20%" }}>
                  Номенклатура
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Цена
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Заказано (кг)
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Тара
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Отгружено (кг)
                </TableCell>
                <TableCell align="left" style={{ width: "15%" }}>
                  Отгружено (шт)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listProdsEveryOrder?.map((row, index) => (
                <TableRow
                  key={`${row?.product_guid}`}
                  className={
                    row?.product_guid == active?.product_guid
                      ? "activeGuid"
                      : ""
                  }
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
                    align="left"
                    component="th"
                    scope="row"
                    style={{ width: "20%" }}
                  >
                    {row?.product_name}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "15%" }}
                  >
                    {row?.price} сом
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.ordered || 0}
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.tara || 0}
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.count}
                  </TableCell>
                  <TableCell align="left" style={{ width: "15%" }}>
                    {row?.count_kg}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <ModalAddProd closeModal={closeModal} modal={modal} setModal={setModal} />
    </div>
  );
};

export default OrdersWH_Page;
