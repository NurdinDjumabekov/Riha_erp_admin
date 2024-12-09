import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

////// style
import "./style.scss";
import { roundingNum } from "../../../helpers/totals";

const GraphicsProds = (props) => {
  const { list } = props;

  const listNew = [...list]
    ?.sort(
      (a, b) => roundingNum(b?.count_kg) || 0 - roundingNum(a?.count_kg) || 0
    )
    ?.slice(0, 12);

  const listGraphocs = listNew?.map((item, index) => ({
    ...item,
    pv: roundingNum(item?.count_kg), ///  проценты
    name:
      item?.product_name.length > 15
        ? `${item?.product_name.slice(0, 15)}...`
        : item?.product_name,
    amt: roundingNum(item?.count_kg),
  }));

  const CustomTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="customTooltipProds">
          <div className="info">
            <span className="left">Товар: </span>
            <span>{payload?.[0]?.payload?.product_name}</span>
          </div>
          <div className="info">
            <span className="left">Реализовано: </span>
            <span>
              {payload?.[0]?.payload?.amt} кг
              {/* ({payload?.[0]?.value} %) */}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={listGraphocs}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="1 3" />
        <XAxis
          dataKey="name"
          //   domain={[0, 100]}
          interval={0} // Отображает каждое наименование
          tick={{
            width: 100, // Задает максимальную ширину для текста
            wordWrap: "break-word", // Перенос слов
            fontSize: 10, // Уменьшает шрифт для лучшей читаемости
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="pv" barSize={30} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GraphicsProds;
