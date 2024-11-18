/////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

/////// components
import ModalAddProd from "../../../components/WareHomePages/ModalAddProd/ModalAddProd";
import { Paper, TableCell, Table } from "@mui/material";
import { TableHead, TableRow, TableContainer } from "@mui/material";
import { FixedSizeList as List } from "react-window";

////// icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

////// fns
import { searchProdsWH_Req } from "../../../store/reducers/wareHouseSlice";

////// style
import "./style.scss";

const SearchProdsWH_Page = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const refInput = useRef(null);
  const listContainerRef = useRef(null);
  const [listHeight, setListHeight] = useState(400);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, setModal] = useState({});

  const listRef = useRef(null);
  const { listProdsWH } = useSelector((state) => state.wareHouseSlice);

  useEffect(() => {
    dispatch(searchProdsWH_Req());
    setActiveIndex(0);
  }, [dispatch]);

  useEffect(() => {
    const updateHeight = () => {
      if (listContainerRef.current) {
        const parentHeight = listContainerRef.current.offsetHeight;
        setListHeight(parentHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (listContainerRef.current) {
      resizeObserver.observe(listContainerRef.current);
    }

    updateHeight();

    return () => {
      if (listContainerRef.current) {
        resizeObserver.unobserve(listContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(activeIndex, "center");
    }
  }, [activeIndex]);

  const searchProds = () => {
    const query = refInput.current?.value?.trim() || "";
    dispatch(searchProdsWH_Req(query));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown" && activeIndex < listProdsWH?.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (event.key === "ArrowUp" && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      } else if (event.key === "Escape") {
        console.log();
        if (!!modal?.product_guid) {
          if (event.key === "Escape") return closeModal();
        } else {
          navigate(-1);
        }
      } else if (event.ctrlKey && (event.key === "z" || event.key === "я")) {
        refInput.current?.focus();
      } else if (event.key === "Enter") {
        if (document.activeElement === refInput.current) {
          searchProds();
          refInput.current?.blur();
        } else {
          enterClick({}, activeIndex);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, listProdsWH, modal]);

  const closeModal = () => setModal({});

  const enterClick = (i, index) => {
    setActiveIndex(index);
    const obj = listProdsWH?.find((j, index) => index == activeIndex);
    setModal({
      ...obj,
      price: obj?.workshop_price,
      invoice_guid: state?.invoice_guid,
    });
  };

  const Row = ({ index, style }) => {
    const row = listProdsWH?.[index];
    const isActive = index === activeIndex;

    return (
      <TableRow
        style={style}
        key={row?.product_guid}
        className={isActive ? "activeGuid" : ""}
        onClick={() => enterClick(row, index)}
      >
        <TableCell align="center" style={{ width: "10%" }}>
          {index + 1}
        </TableCell>
        <TableCell align="left" style={{ width: "60%" }}>
          {row?.product_name}
        </TableCell>
        <TableCell style={{ width: "30%" }}>
          {`${row?.workshop_price} сом`}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="ordersWH searchBlockWH">
      <div className="headerSort">
        <button onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </button>
        <div className="inputSend searchWH">
          <p>Поиск товаров</p>
          <input
            type="search"
            ref={refInput}
            placeholder="Поиск товаров"
            onChange={searchProds}
          />
        </div>
      </div>
      <div className="ordersWH__inner" ref={listContainerRef}>
        <TableContainer
          component={Paper}
          className="scroll_table standartTable"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ width: "10%" }}>
                  №
                </TableCell>
                <TableCell align="left" style={{ width: "60%" }}>
                  Номенклатура
                </TableCell>
                <TableCell align="left" style={{ width: "30%" }}>
                  Цена
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <List
            ref={listRef}
            height={listHeight - 62}
            itemCount={listProdsWH?.length}
            itemSize={50}
            width="100%"
          >
            {Row}
          </List>
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

export default SearchProdsWH_Page;
