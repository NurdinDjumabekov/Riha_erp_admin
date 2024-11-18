////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import ModalAddProd from "../../../components/WareHomePages/ModalAddProd/ModalAddProd";

////// fns
import { getEveryOrderTA } from "../../../store/reducers/wareHouseSlice";
import { addProdInInvoiceReq } from "../../../store/reducers/wareHouseSlice";

////// icons
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

////// style
import "./style.scss";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";

const OrdersWH_Page = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [active, setActive] = useState({});
  const [modal, setModal] = useState({});
  const [comment, setComment] = useState("");
  const refComment = useRef(null);

  const { listProdsEveryOrder } = useSelector((state) => state.wareHouseSlice);

  const getData = async () => {
    const res = await dispatch(getEveryOrderTA(state?.guid)).unwrap();
    /// get список заказов от ТА для отпуска
    setActive(res?.products?.[0] || {});
    setComment(res?.comment);
  };

  const list = listProdsEveryOrder?.products;

  useEffect(() => {
    getData();
  }, [state?.guid]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!!modal?.product_guid || list?.length === 0) {
        if (event.key === "Escape") {
          closeModal();
        }
        return;
      }

      const index = list?.findIndex(
        (item) => item?.product_guid == active?.product_guid
      );

      if (event.key === "ArrowDown" && index < list?.length - 1) {
        setActive(list?.[index + 1]);
      }
      if (event.key === "ArrowUp" && index > 0) {
        setActive(list?.[index - 1]);
      }
      if (event.key === "Enter") {
        if (document.activeElement === refComment.current) {
          addComment();
        } else {
          enterClick(active);
        }
      }
      if (event.key === "Escape") {
        navigate(-1);
      }
      if (event.ctrlKey && (event.key === "x" || event.key === "ч")) {
        event.preventDefault();
        refComment.current.focus();
      }

      if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
        event.preventDefault();
        navSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [list, active, modal?.product_guid]);

  const enterClick = (obj) => {
    setActive(obj);
    setModal(obj);
  };

  const closeModal = () => setModal({});

  const addComment = async () => {
    const send = {
      invoice_guid: listProdsEveryOrder?.invoice_guid,
      products: [],
      comment: refComment.current.value,
    };
    const res = await dispatch(addProdInInvoiceReq(send)).unwrap();
    if (!!res?.result) {
      refComment.current.blur();
      myAlert("Ваш комментарий добавлен");
    }
  };

  const navSearch = () => {
    navigate("/ware_home/search", { state: { ...listProdsEveryOrder } });
  };

  return (
    <div className="ordersWH">
      <div className="headerSort">
        <h6>Торговый агент: {state?.fio}</h6>
        <div className="inputs">
          <div className="inputSend">
            <p>Комментарий</p>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              name={"comment"}
              ref={refComment}
            />
          </div>
          <button onClick={navSearch}>
            <AddToPhotosIcon />
            <p>Добавить товар</p>
          </button>
        </div>
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
              {list?.map((row, index) => (
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
      <ModalAddProd
        state={state}
        closeModal={closeModal}
        modal={modal}
        setModal={setModal}
      />
    </div>
  );
};

export default OrdersWH_Page;
