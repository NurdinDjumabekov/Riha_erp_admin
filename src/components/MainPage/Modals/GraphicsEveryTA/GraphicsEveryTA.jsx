////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

////// style
import "./style.scss";

////// fns
import { setListWorkPlan } from "../../../../store/reducers/mainSlice";

////// icons

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GraphicsEveryTA = () => {
  const dispatch = useDispatch();

  const { listWorkPlan } = useSelector((state) => state.mainSlice);

  const handleClose = () => dispatch(setListWorkPlan([])); /// очищаю для закрытия модалки

  const COLORS = ["#808080", "#43e843"];

  // Функция для отображения процентов
  const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <Dialog
      fullScreen
      open={listWorkPlan?.length !== 0}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="graphicsEveryTA">
        <div className="mainOrders__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                План работы
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={360} height={360}>
            <Pie
              data={listWorkPlan}
              cy={250} // Центрирование по горизонтали
              cx="50%"
              innerRadius={80} // внутренний радиус для пончиковой диаграммы
              outerRadius={120} // внешний радиус
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={renderLabel} // добавляем кастомную функцию для отображения процентов
            >
              {listWorkPlan?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="graphicsEveryTA__info">
          {listWorkPlan?.map((i, index) => (
            <div>
              <div style={{ background: COLORS[index] }}></div>
              <p style={{ color: COLORS[index] }}>
                {i?.name}: {i?.value}%
              </p>
            </div>
          ))}
          <div>
            <div style={{ background: "#d91313" }}></div>
            <p style={{ color: "#d91313" }}>Общий план:</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default GraphicsEveryTA;
