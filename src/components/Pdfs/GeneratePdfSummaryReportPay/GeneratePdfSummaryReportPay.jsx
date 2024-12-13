/////// hooks
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

////// styles
import { styles } from "./style";
import "./style.scss";

////// helpers
import { transformDateTime } from "../../../helpers/transformDate";
import { startOfWeek, endOfWeek, format } from "date-fns";

////// components
import Modals from "../../../common/Modals/Modals";
import { Document, Page, Text } from "@react-pdf/renderer";
import { View, PDFViewer } from "@react-pdf/renderer";

////// icons
import FileCopyIcon from "@mui/icons-material/FileCopy";

const GeneratePdfSummaryReportPay = ({ selectedDate }) => {
  const { state } = useLocation();

  const [active, setActive] = useState(false);
  const { reportSummary } = useSelector((state) => state.reportsSlice);

  ////// точки БЦ
  const { left: bs_point_left, right: bs_point_right } =
    splitArrayIntoTwoEqualParts(reportSummary?.bs_point?.slice(0, 10) || []);

  ////// точки маркеты
  ////// точки БЦ
  const { left: market_point_left, right: market_point_right } =
    splitArrayIntoTwoEqualParts(reportSummary?.market_point || []);

  const { left: ft_point_left, right: ft_point_right } =
    splitArrayIntoTwoEqualParts(reportSummary?.ft_point || []);

  const { left: ta_spending_left, right: ta_spending_right } =
    splitArrayIntoTwoEqualParts(reportSummary?.ta_spending || []);

  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = endOfWeek(selectedDate, { weekStartsOn: 1 });

  return (
    <div className="generateBlock">
      <button className="activePdf" onClick={() => setActive(true)}>
        <FileCopyIcon />
        <p>Сгенерировать отчёт</p>
      </button>
      <Modals
        openModal={active}
        closeModal={() => setActive(false)}
        title={`Сводный отчёт / документ`}
      >
        <PDFViewer>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.header}>
                  ФИ ТА {state?.fio} , дата и время распечатки:{" "}
                  {transformDateTime(new Date())}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.header}>
                  Остаток на начало:{" "}
                  {reportSummary?.week?.[0]?.total_start_week}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.textTitle]}>Дата</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Приход (утро)</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Вечер</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Касса</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Возврат</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Траты</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={styles.textTitle}>Остаток на конец</Text>
                  </View>
                </View>
                {reportSummary?.week?.map((row, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.date}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.income}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.outcome}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.kassa}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.return}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>{row?.spending}</Text>
                    </View>
                    <View style={[styles.tableCol]}>
                      <Text style={[styles.tableCell]}>
                        {row?.leftovers_day}
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>Итого</Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.income_total}
                    </Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.outcome_total}
                    </Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.kassa_total}
                    </Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.return_total}
                    </Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.spending_total}
                    </Text>
                  </View>
                  <View style={[styles.tableCol]}>
                    <Text style={[styles.tableCell]}>
                      {reportSummary?.week?.[0]?.leftovers_day_total}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ////////////////// бц */}
              <Text style={styles.centerTitle}>Долги по магазинам</Text>
              <View style={styles.twoTable}>
                <View style={styles.twoTable}>
                  <View style={[styles.table]}>
                    {bs_point_left?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColBC, styles.indexs]}>
                          <Text style={[styles.tableCellBC, styles.indexInner]}>
                            {row?.index || ""}
                          </Text>
                        </View>
                        <View style={[styles.tableColBC]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.name || ""}
                          </Text>
                        </View>
                        <View style={[styles.tableColSumBC]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.dolg || ""}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.table, styles.leftNonetable]}>
                    {bs_point_right?.map((row, index) => (
                      <View style={styles.tableRow} key={`second-${index}`}>
                        <View style={[styles.tableColBC, styles.indexs]}>
                          <Text style={[styles.tableCellBC, styles.indexInner]}>
                            {row?.index || ""}
                          </Text>
                        </View>
                        <View style={[styles.tableColBC]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.name || ""}
                          </Text>
                        </View>
                        <View style={[styles.tableColSumBC]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.dolg || ""}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={[styles.podpisTotal]}>
                <Text style={styles.linetext}>Итоговая сумма: </Text>
                <Text style={styles.linetext}>
                  {bs_point_left?.[0]?.total_bs_points}
                </Text>
              </View>

              <View style={[styles.podpis]}>
                <Text style={styles.line}></Text>
                <Text style={styles.linetext}>ФИО (роспись)</Text>
              </View>

              {/* ////////////////// фт */}
              <View style={styles.section}>
                <Text style={styles.header}>
                  Отчёт по маркетам ________________________ период с{" "}
                  {format(start, "yyyy-MM-dd")} по {format(end, "yyyy-MM-dd")}
                </Text>
              </View>

              <View style={styles.twoTable}>
                <View style={styles.twoTable}>
                  <View style={[styles.table]}>
                    {market_point_left?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>{row?.date}</Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>{row?.name}</Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.dolg}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.table, styles.leftNonetable]}>
                    {market_point_right?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>{row?.date}</Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>{row?.name}</Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.dolg}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* ////////////////// маркеты */}
              <View style={styles.section}>
                <Text style={styles.header}>
                  Отчёт по фт ________________________ период с{" "}
                  {format(start, "yyyy-MM-dd")} по {format(end, "yyyy-MM-dd")}
                </Text>
              </View>

              <View style={styles.twoTable}>
                <View style={styles.twoTable}>
                  <View style={[styles.table]}>
                    {ft_point_left?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>{row?.date}</Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>{row?.name}</Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.dolg}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.table, styles.leftNonetable]}>
                    {ft_point_right?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>{row?.date}</Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>{row?.name}</Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.dolg}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* ////////////////// траты ТА */}
              <View style={styles.section}>
                <Text style={styles.header}>
                  Отчёт по тратам ________________________ период с{" "}
                  {format(start, "yyyy-MM-dd")} по {format(end, "yyyy-MM-dd")}
                </Text>
              </View>

              <View style={styles.twoTable}>
                <View style={styles.twoTable}>
                  <View style={[styles.table]}>
                    {ta_spending_left?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.date_time}
                          </Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.comment}
                          </Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.sum}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.table, styles.leftNonetable]}>
                    {ta_spending_right?.map((row, index) => (
                      <View style={styles.tableRow} key={`first-${index}`}>
                        <View style={[styles.tableColMarketMini]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.date_time}
                          </Text>
                        </View>
                        <View style={[styles.tableColMarketMidle]}>
                          <Text style={[styles.tableCellBC]}>
                            {row?.comment}
                          </Text>
                        </View>
                        <View style={[styles.tableColMarket]}>
                          <Text style={[styles.tableCellBC]}>{row?.sum}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </Modals>
    </div>
  );
};

export default GeneratePdfSummaryReportPay;

const splitArrayIntoTwoEqualParts = (array) => {
  const defaultEmptyRows = 4; // Минимальное количество строк, если массив пустой
  const isArrayEmpty = !array || array.length === 0;

  if (isArrayEmpty) {
    return {
      left: Array(defaultEmptyRows).fill({}),
      right: Array(defaultEmptyRows).fill({}),
    };
  }

  const midIndex = Math.ceil(array.length / 2); // Точка разделения
  const firstHalf = array.slice(0, midIndex); // Первая половина
  const secondHalf = array.slice(midIndex); // Вторая половина
  const maxRows = Math.max(firstHalf.length, secondHalf.length);

  return {
    left: [...firstHalf, ...Array(maxRows - firstHalf.length).fill({})],
    right: [...secondHalf, ...Array(maxRows - secondHalf.length).fill({})],
  };
};
