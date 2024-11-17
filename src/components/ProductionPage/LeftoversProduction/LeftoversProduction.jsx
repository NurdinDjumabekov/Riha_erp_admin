////// hooks
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";

////// icons
import ChecklistIcon from "@mui/icons-material/Checklist";

////// style
import "./style.scss";

////// fns
import { getListLeftoversProduction } from "../../../store/reducers/productionSlice";

const LeftoversProduction = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(getListLeftoversProduction());
  }, []);

  const addProdInProduvtion = () => {};

  return (
    <div className="leftoversProduction">
      <header className="titles">
        <h6>Остаток в производстве</h6>
        <button onClick={addProdInProduvtion} className="sendData">
          <ChecklistIcon sx={{ width: 16 }} />
          <p>Добавить в накладную</p>
        </button>
      </header>
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
              <TableCell style={{ width: "35%" }}>Продукт</TableCell>
              <TableCell align="left" style={{ width: "10%" }}>
                Остаток (кг)
              </TableCell>
              <TableCell align="left" style={{ width: "15%" }}>
                Дата изготовления
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[]?.map((row, index) => (
              <TableRow key={row?.product_guid}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ width: "5%" }}
                  align="center"
                >
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" style={{ width: "35%" }}>
                  {row?.product_name}
                </TableCell>

                <TableCell align="left" style={{ width: "10%" }}>
                  {/* {roundingNum(+row?.countOld)} {row?.unit} */}
                </TableCell>

                <TableCell align="left" style={{ width: "15%" }}>
                  {/* {activeInvoice?.date_from} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeftoversProduction;
