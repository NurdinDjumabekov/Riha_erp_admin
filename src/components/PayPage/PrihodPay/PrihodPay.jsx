////// hooks
import { useState } from "react";
import { useSelector } from "react-redux";

////// style
import "./style.scss";

////// components
import { Table, TableBody, TableCell, Tooltip } from "@mui/material";
import { TableContainer, TableHead } from "@mui/material";
import { TableRow, Paper } from "@mui/material";
import AcceptPay from "../AcceptPay/AcceptPay";

////// helpers
import { roundingNum, sumByKey } from "../../../helpers/totals";
import { statusStandart } from "../../../helpers/objs";

/////// icons
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import GeneratePdfPayKassaReport from "../../Pdfs/GeneratePdfPayKassaReport/GeneratePdfPayKassaReport";
import { statusPayObj } from "../../../helpers/LocalData";

const PrihodPay = ({ active }) => {
  const [obj, setObj] = useState();

  const { user_type } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { listTA } = useSelector((state) => state.mainSlice);
  const { debtEveryTA } = useSelector((state) => state.paySlice);

  const closeModal = () => setObj();
  const [pdf, setPdf] = useState({});

  const [listItem] = listTA?.filter((i) => i?.guid == active);

  const addPayModal = () => {
    /// для добавления
    setObj({
      amount: "",
      comment: "выручка",
      status: { value: 2, label: "Оплата принята" },
      agent_guid: listItem?.guid,
      return_amount: 0,
      user_guid: listItem?.guid,
      user_type: 1,
      user_guid_to: "B85094A9-D70A-46AB-A724-5F3D7A506B37",
      user_type_to: 2,
    });
  };

  const editPayModal = (item) => {
    const send = {
      amount: item?.amount,
      comment: item?.comment,
      status: {
        value: item?.status || 0,
        label: statusPayObj?.[item?.status || 0],
      },
      agent_guid: item?.agent_guid,
      return_amount: 0,
      user_guid: item?.agent_guid,
      user_type: 1,
      user_guid_to: "B85094A9-D70A-46AB-A724-5F3D7A506B37",
      user_type_to: 2,
    };
    setObj(send);
  };

  const printBlank = (item) => setPdf(item);
  //// открываю модалку для распечатки чека в кассу

  return (
    <>
      <div className="prihodPay">
        <div className="dolg">
          <div className="header">
            <h5>Оплаты</h5>
            <button className="saveAction" onClick={addPayModal}>
              <NoteAddIcon sx={{ width: 16, height: 16 }} />
              <p>Принять оплату</p>
            </button>
          </div>
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
                      ФИО
                    </TableCell>
                    <TableCell align="left" style={{ width: "15%" }}>
                      Дата
                    </TableCell>
                    <TableCell align="left" style={{ width: "15%" }}>
                      Сумма
                    </TableCell>
                    <TableCell align="left" style={{ width: "15%" }}>
                      Комментарий
                    </TableCell>
                    <TableCell align="left" style={{ width: "10%" }}>
                      Статус
                    </TableCell>
                    <TableCell align="left" style={{ width: "15%" }}>
                      Чек
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debtEveryTA?.dolg?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "5%" }}
                        align="center"
                      >
                        {row?.invoice_codeid}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "15%" }}
                      >
                        {row?.agent_fio}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "15%" }}
                      >
                        {row?.date}
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "15%" }}
                      >
                        {roundingNum(row?.amount)} сом
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "15%" }}
                      >
                        {row?.comment || "..."}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          width: "10%",
                        }}
                      >
                        <div className="status">
                          <p
                            style={{
                              color:
                                statusStandart?.[row?.status]?.color || "red",
                            }}
                          >
                            {statusStandart?.[row?.status]?.text || "Ожидание"}
                          </p>
                          <Tooltip
                            title={"Изменить статус"}
                            placement="top"
                            disableInteractive
                          >
                            <button onClick={() => editPayModal(row)}>
                              <EditNoteIcon />
                            </button>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ width: "15%", cursor: "pointer" }}
                        onClick={() => printBlank(row)}
                      >
                        Распечатать бланк
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="left"></TableCell>
                    <TableCell
                      colSpan={2}
                      align="left"
                      className="footerTable"
                      style={{ paddingLeft: 0, height: 40 }}
                    >
                      Итого
                    </TableCell>
                    <TableCell
                      colSpan={4}
                      align="left"
                      style={{ fontWeight: "bold", height: 40 }}
                    >
                      {roundingNum(sumByKey(debtEveryTA?.dolg, "amount"))} сом
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      <AcceptPay
        active={active}
        setObj={setObj}
        obj={obj}
        closeModal={closeModal}
        listItem={listItem}
      />
      <GeneratePdfPayKassaReport pdf={pdf} setPdf={setPdf} />
    </>
  );
};

export default PrihodPay;
