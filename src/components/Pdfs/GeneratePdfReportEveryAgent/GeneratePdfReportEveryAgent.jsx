/////// hooks
import { useState } from "react";
import { useLocation } from "react-router-dom";

////// styles
import { styles } from "./style";
import "./style.scss";

////// helpers
import { transformActionDate } from "../../../helpers/transformDate";
import { formatDateMonth } from "../../../helpers/transformDate";

////// components
import Modals from "../../../common/Modals/Modals";
import { Document, Page, Text } from "@react-pdf/renderer";
import { View, PDFViewer } from "@react-pdf/renderer";

////// icons
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { roundingNum } from "../../../helpers/totals";

const GeneratePdfReportEveryAgent = ({ list, dateTime }) => {
  const { state } = useLocation();

  const [active, setActive] = useState(false);

  const realizDate = formatDateMonth(transformActionDate(dateTime));

  return (
    <div className="generateBlock">
      <button className="activePdf" onClick={() => setActive(true)}>
        <FileCopyIcon />
        <p>Сгенерировать документ</p>
      </button>
      <Modals
        openModal={active}
        closeModal={() => setActive(false)}
        title={`Реализация агента / документ`}
      >
        <PDFViewer>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.header}>
                  Отчёт продаж агента {state?.fio} за {realizDate}
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol, styles.numsTitle]}>
                    <Text style={[styles.textTitle, styles.nums]}>№</Text>
                  </View>
                  <View style={[styles.tableCol, styles.names]}>
                    <Text style={styles.textTitle}>Наименование</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Цена</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Сумма</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Реализация (кг)</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Реализация (шт)</Text>
                  </View>
                </View>
                {list?.map((i, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={[styles.tableCol, styles.numsMain]}>
                      <Text style={[styles.tableCell, { textAlign: "center" }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.namesInner]}>
                      <Text style={[styles.tableCell, styles.numsInnerText]}>
                        {i?.product_name}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>
                        {roundingNum(i?.price) || 0} сом
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>
                        {roundingNum(i?.total_price) || 0} сом
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>
                        {roundingNum(i?.count_kg) || 0}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>
                        {roundingNum(i?.count) || 0}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.result}>
                <View style={styles.resultInner}>
                  <Text style={styles.resultContent}>Сумма: </Text>
                  <Text style={styles.resultContent}>
                    {list?.[0]?.total_price_all || 0} сом
                  </Text>
                </View>
                <View style={styles.resultInner}>
                  <Text style={styles.resultContent}>Масса: </Text>
                  <Text style={styles.resultContent}>
                    {list?.[0]?.total_count_kg || 0}
                  </Text>
                </View>
                <View style={styles.resultInner}>
                  <Text style={styles.resultContent}>Кол-во: </Text>
                  <Text style={styles.resultContent}>
                    {list?.[0]?.total_count || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.footer}>
                {/* <View style={styles.accept}>
                  <View style={styles.acceptSend}>
                    <View style={styles.acceptText}>
                      <Text style={styles.linetext}>Отпустил</Text>
                      <Text style={styles.line}></Text>
                    </View>
                  </View>
                  <View style={styles.acceptSend}>
                    <View style={styles.acceptText}>
                      <Text style={styles.linetext}>Получил</Text>
                      <Text style={styles.line}></Text>
                    </View>
                  </View>
                </View> */}
                <View style={[styles.acceptText, styles.acceptTextMore]}>
                  <Text style={styles.linetext}>Комментарий</Text>
                  <Text style={styles.line}></Text>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </Modals>
    </div>
  );
};

export default GeneratePdfReportEveryAgent;
