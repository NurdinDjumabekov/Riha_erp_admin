/////// hooks
import { useState } from "react";

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

const GeneratePdfProduction = ({ activeInvoice }) => {
  const [active, setActive] = useState(false);

  console.log(activeInvoice?.products);

  return (
    <div className="generateBlock">
      <button className="activePdf" onClick={() => setActive(true)}>
        <FileCopyIcon />
        <p>Сгенерировать документ</p>
      </button>
      <Modals
        openModal={active}
        closeModal={() => setActive(false)}
        title={`Производство / документ`}
      >
        <PDFViewer>
          <Document>
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.header}>Отправитель:</Text>
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
                    <Text style={styles.textTitle}>Заказано в кг</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Заказано в шт</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Выпущено кг</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>Выпущено шт</Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>
                      Дата начала изготовления
                    </Text>
                  </View>
                  <View style={[styles.tableCol, styles.headersOther]}>
                    <Text style={styles.textTitle}>
                      Дата окончания изготовления
                    </Text>
                  </View>
                </View>

                {activeInvoice?.products?.map((i, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={[styles.tableCol, styles.numsMain]}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.namesInner]}>
                      <Text style={[styles.tableCell, styles.numsInnerText]}>
                        {i?.product_name}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.count}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.count}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.change}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.change}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.date_from}</Text>
                    </View>
                    <View style={[styles.tableCol, styles.headersOther]}>
                      <Text style={styles.tableCell}>{i?.date_to}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.result}></View>

              <View style={styles.footer}>
                <View style={styles.accept}>
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
                </View>
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

export default GeneratePdfProduction;
