////// hooks
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import AddSpending from "../AddSpending/AddSpending";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import ChangeStatusSpending from "../ChangeStatusSpending/ChangeStatusSpending";

/////// helpers
import { clearDataSpending } from "../../../helpers/clear";
import { myAlert } from "../../../helpers/MyAlert";

/////// fns
import { getListSpendingTA } from "../../../store/reducers/taskExpensesSlice";
import { delSpending } from "../../../store/reducers/taskExpensesSlice";

/////// icons
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";
import EditIcon from "../../../assets/MyIcons/EditIcon";
import { statusAll } from "../../../helpers/objs";

const TableSpendings = ({ active, dateRange }) => {
  const dispatch = useDispatch();

  const { listSpendingTA } = useSelector((state) => state.taskExpensesSlice);

  const [obj, setObj] = useState({
    amount: "",
    comment: "",
    type: 0,
    spending: { value: "", label: "" },
  });
  /// 1 - создание траты , 2 - редактирование траты

  const [statusAction, setStatusAction] = useState({}); ///  для принятия и отклонения трат
  const [actionDel, setActionDel] = useState(""); ///  для удаления траты

  const closeModal = () => {
    setObj(clearDataSpending);
    setStatusAction({});
  };

  const delSpendingFN = async () => {
    ///// удаление расходов
    const send = { expense_guid: actionDel };
    const response = await dispatch(delSpending(send)).unwrap(); // удаление расходов
    if (response?.result == 1) {
      myAlert(response?.msg);
      dispatch(getListSpendingTA({ dateRange, active })); /// get список возможных трат TA
      setActionDel("");
    }
  };

  const openModalStatus = ({ user_guid, user_type, guid }) => {
    //// открытия модлаки для изменения статтуса трат
    const send = { user_guid, user_type, expense_guid: guid, comment: "" };
    setStatusAction({ ...send, status: { label: "Принять", value: "1" } });
  };

  return (
    <div className="infoProdsApp tableSpending">
      <div className="dolg">
        <h5>Траты торговых агентов</h5>
        <button
          className="saveAction"
          onClick={() => setObj({ ...obj, type: 1 })}
        >
          <NoteAddIcon sx={{ width: 16, height: 16 }} />
          <p>Добавить трату</p>
        </button>
        <div className="dolg__inner">
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
                  <TableCell align="left" style={{ width: "15%" }}>
                    Наименование
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Дата создания
                  </TableCell>
                  <TableCell align="left" style={{ width: "10%" }}>
                    Сумма
                  </TableCell>
                  <TableCell align="left" style={{ width: "7%" }}>
                    Статус
                  </TableCell>
                  <TableCell align="center" style={{ width: "5%" }}>
                    *
                  </TableCell>
                  <TableCell align="left" style={{ width: "24%" }}>
                    Комментарий
                  </TableCell>
                  <TableCell align="left" style={{ width: "24%" }}>
                    Комментарий
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listSpendingTA?.map((row, index) => (
                  <TableRow key={row?.codeid} className="everyInvoice">
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "5%" }}
                      align="center"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row?.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "10%" }}
                    >
                      {row?.date}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "10%" }}
                    >
                      {row?.amount} сом
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "7%", color: statusAll?.[row?.status] }}
                    >
                      {row?.status_name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "5%" }}
                    >
                      <div className="actions">
                        <button onClick={() => openModalStatus(row)}>
                          <EditIcon width={17} height={17} />
                        </button>
                        <button onClick={() => setActionDel(row?.guid)}>
                          <DeleteIcon width={19} height={19} color={"red"} />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "24%" }}
                    >
                      {row?.comment}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "24%" }}
                    >
                      {row?.status_comment}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddSpending
        setObj={setObj}
        obj={obj}
        closeModal={closeModal}
        active={active}
        dateRange={dateRange}
      />

      <ChangeStatusSpending
        setStatusAction={setStatusAction}
        statusAction={statusAction}
        closeModal={closeModal}
        active={active}
        dateRange={dateRange}
      />

      <ConfirmModal
        state={actionDel}
        yesFN={delSpendingFN}
        noFN={() => setActionDel("")}
        title={"Удалить ?"}
      />
    </div>
  );
};

export default TableSpendings;
