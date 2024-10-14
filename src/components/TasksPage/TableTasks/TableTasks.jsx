////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import AddTasks from "../AddTasks/AddTasks";

/////// helpers
import { transformActionDate } from "../../../helpers/transformDate";
import { reverseTransformActionTime } from "../../../helpers/transformDate";
import { clearDataTasks } from "../../../helpers/clear";

/////// fns
import { changeStatusTasks } from "../../../store/reducers/taskExpensesSlice";
import { getTasks } from "../../../store/reducers/taskExpensesSlice";

////// icons
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "../../../assets/MyIcons/DeleteIcon";
import EditIcon from "../../../assets/MyIcons/EditIcon";

const TableTasks = ({ activeTA, activeTT, dateRange }) => {
  const dispatch = useDispatch();

  const [obj, setObj] = useState({
    deadline_date: new Date(),
    comment: "",
    task_guid: "",
    filesUser: [],
    filesAgent: [],
    type: 0, /// 1 - создание задачи , 2 - редактирование задачи
  });

  const { listTasks } = useSelector((state) => state.taskExpensesSlice);

  const editStatusTasks = async (status, { guid }) => {
    //// 0 - Ожидание, 1 - В процессе, 2 - Готов, -1 - Удаление
    const data = { task_guid: guid, comment: "удаление", status };
    const response = await dispatch(changeStatusTasks(data)).unwrap();
    if (response?.result == 1) {
      const sendData = {
        agent_guid: activeTA,
        date_from: transformActionDate(dateRange?.[0]),
        date_to: transformActionDate(dateRange?.[0]),
        point_guid: activeTT,
      };
      dispatch(getTasks(sendData)); ///  get список задач
    }
  };

  const openModalEditTasks = ({ guid, deadline, comment }) => {
    //// для изменения данных в самом таске
    const time = reverseTransformActionTime(deadline);
    setObj({ ...obj, type: 2, task_guid: guid, deadline_date: time, comment });
  };

  const closeModal = () => setObj(clearDataTasks); /// очистка состояния

  return (
    <div className="infoProdsApp tableTasks">
      <div className="dolg">
        <h5>Задания</h5>
        <button
          className="saveAction"
          onClick={() => setObj({ ...obj, type: 1 })}
        >
          <NoteAddIcon sx={{ width: 16, height: 16 }} />
          <p>Добавить задание</p>
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
                  <TableCell align="center" style={{ width: "4%" }}>
                    №
                  </TableCell>
                  <TableCell align="left" style={{ width: "13%" }}>
                    Дата создания
                  </TableCell>
                  <TableCell align="left" style={{ width: "13%" }}>
                    Дата исполнения
                  </TableCell>
                  <TableCell align="left" style={{ width: "13%" }}>
                    Статус
                  </TableCell>
                  <TableCell align="left" style={{ width: "23%" }}>
                    Комментарий
                  </TableCell>
                  <TableCell align="left" style={{ width: "13%" }}>
                    Файлы админа
                  </TableCell>
                  <TableCell align="left" style={{ width: "13%" }}>
                    Файлы агента
                  </TableCell>
                  <TableCell align="center" style={{ width: "8%" }}>
                    *
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listTasks?.map((row, index) => (
                  <TableRow key={row?.codeid} className="everyInvoice">
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "4%" }}
                      align="center"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "13%" }}
                    >
                      {row?.date}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "13%" }}
                    >
                      {row?.deadline}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "13%" }}
                    >
                      {row?.status_name}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "23%" }}
                    >
                      {row?.comment}
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "13%" }}
                    ></TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "13%" }}
                    ></TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "8%" }}
                    >
                      <div className="actions">
                        <button onClick={() => openModalEditTasks(row)}>
                          <EditIcon width={17} height={17} />
                        </button>
                        <button onClick={() => editStatusTasks(-1, row)}>
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
      </div>
      <AddTasks
        activeTA={activeTA}
        activeTT={activeTT}
        dateRange={dateRange}
        obj={obj}
        setObj={setObj}
        closeModal={closeModal}
      />
    </div>
  );
};

export default TableTasks;
