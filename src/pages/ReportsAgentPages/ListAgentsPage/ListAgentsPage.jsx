////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// fns

////// icons

///// components

const ListAgentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listTA } = useSelector((state) => state.mainSlice);
  const [searchTerm, setSearchTerm] = useState("");

  // Фильтрация массива на основе строки поиска
  const filteredList = listTA?.filter((agent) =>
    agent?.fio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clickAgent = (obj) => {
    navigate("/report_ta/agent_every", { state: obj });
  };

  return (
    <div className="listAgentsPage">
      <div className="header">
        <input
          type="search"
          placeholder="Поиск агентов"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Обновление строки поиска
        />
      </div>
      <div className="body">
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
                <TableCell align="left" style={{ width: "60%" }}>
                  Агент
                </TableCell>
                <TableCell align="left" style={{ width: "35%" }}>
                  Баланс
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredList?.map((row, index) => (
                <TableRow key={`${row?.guid}`} onClick={() => clickAgent(row)}>
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
                    style={{ width: "60%" }}
                  >
                    {row?.fio}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "35%" }}
                  >
                    {row?.balance} сом
                  </TableCell>
                </TableRow>
              ))}
              {filteredList?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ListAgentsPage;
