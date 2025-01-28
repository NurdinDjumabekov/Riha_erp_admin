// import { ru } from "date-fns/locale";

// ////// hooks
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// ////// components
// import { Table, TableBody, TableCell } from "@mui/material";
// import { TableContainer, TableHead } from "@mui/material";
// import { TableRow, Paper } from "@mui/material";
// import DatePicker from "react-datepicker";
// import GeneratePdfProduction from "../GeneratePdfProduction/GeneratePdfProduction";

// ////// fns
// import { setActiveDate } from "../../../store/reducers/productionSlice";
// import { getListInvoiceProduction } from "../../../store/reducers/productionSlice";

// ////// style
// import "./style.scss";

// ////// helpers
// import { transformActionDate } from "../../../helpers/transformDate";
// import { reverseTransformActionDate } from "../../../helpers/transformDate";
// import { roundingNum } from "../../../helpers/totals";

// ////// icons
// import EventIcon from "@mui/icons-material/EventNoteTwoTone";

// const HistoryData = () => {
//   const dispatch = useDispatch();

//   const [activeInvoice, setActiveInvoice] = useState({});

//   const { activeDate } = useSelector((state) => state.productionSlice);
//   const { listProduction, listProductionInvoice } = useSelector(
//     (state) => state.productionSlice
//   );

//   const onChangeDate = (item) => {
//     dispatch(setActiveDate(transformActionDate(item)));
//     const obj = {
//       date_from: transformActionDate(item),
//       date_to: "", //// check
//       setActiveInvoice,
//     };
//     dispatch(getListInvoiceProduction(obj));
//   };

//   const clickInvoice = (item) => {
//     setActiveInvoice(item);
//   };

//   useEffect(() => {
//     const obj = { date_from: activeDate, date_to: "", setActiveInvoice };
//     dispatch(getListInvoiceProduction(obj));
//   }, []);

//   return (
//     <div div className="productionData productionHisotry">
//       <div className="productionData__inner">
//         <div className="invoices scroll_table_hover">
//           {listProductionInvoice?.length == 0 ? (
//             <div className="emptyDataInner">
//               <p>Список пустой</p>
//             </div>
//           ) : (
//             listProductionInvoice?.map((item) => (
//               <div
//                 className="invoices__every"
//                 onClick={() => clickInvoice(item)}
//               >
//                 <div className="checkboxTable">
//                   <input
//                     type="checkbox"
//                     name="check"
//                     checked={item?.invoice_guid == activeInvoice?.invoice_guid}
//                   />
//                 </div>
//                 <div>
//                   <h6>Дата создания: {item?.date_from}</h6>
//                   <p>{item?.comment}</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//         <div className="prods">
//           <div className="prods__sortDate">
//             <div className="date inputSend">
//               <p>Дата изготовления</p>
//               <DatePicker
//                 selected={reverseTransformActionDate(activeDate)}
//                 onChange={onChangeDate}
//                 yearDropdownItemNumber={100}
//                 placeholderText="ДД.ММ.ГГГГ"
//                 shouldCloseOnSelect={true}
//                 scrollableYearDropdown
//                 dateFormat="dd.MM.yyyy"
//                 locale={ru}
//                 maxDate={new Date()}
//               />
//               <EventIcon />
//             </div>
//             {/* <GeneratePdfProduction activeInvoice={activeInvoice} /> */}
//           </div>
//           <div className="tableHistory">
//             <TableContainer
//               component={Paper}
//               sx={{ maxHeight: "100%" }}
//               className="scroll_table standartTable"
//             >
//               <Table stickyHeader aria-label="sticky table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell align="center" style={{ width: "5%" }}>
//                       №
//                     </TableCell>
//                     <TableCell style={{ width: "29%" }}>Продукт</TableCell>
//                     <TableCell align="left" style={{ width: "12%" }}>
//                       Было заказано (кг)
//                     </TableCell>
//                     <TableCell align="left" style={{ width: "12%" }}>
//                       Выпущено в кг
//                     </TableCell>
//                     <TableCell align="left" style={{ width: "12%" }}>
//                       Выпущено в шт
//                     </TableCell>
//                     <TableCell align="left" style={{ width: "15%" }}>
//                       Дата начала изготовления
//                     </TableCell>
//                     <TableCell align="left" style={{ width: "15%" }}>
//                       Дата окончания изготовления
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {listProduction?.map((row, index) => (
//                     <TableRow key={row?.product_guid}>
//                       <TableCell
//                         component="th"
//                         scope="row"
//                         style={{ width: "5%" }}
//                         align="center"
//                       >
//                         {index + 1}
//                       </TableCell>
//                       <TableCell
//                         component="th"
//                         scope="row"
//                         style={{ width: "29%" }}
//                       >
//                         {row?.product_name}
//                       </TableCell>
//                       <TableCell align="left" style={{ width: "12%" }}>
//                         {roundingNum(row?.order_count)} кг
//                       </TableCell>
//                       <TableCell align="left" style={{ width: "12%" }}>
//                         {roundingNum(row?.count_kg)} кг
//                       </TableCell>
//                       <TableCell align="left" style={{ width: "12%" }}>
//                         {roundingNum(row?.count)} шт
//                       </TableCell>
//                       <TableCell align="left" style={{ width: "15%" }}>
//                         {row?.date_from}
//                       </TableCell>
//                       <TableCell align="left" style={{ width: "15%" }}>
//                         {row?.date_to}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HistoryData;
