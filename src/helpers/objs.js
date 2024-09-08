/////// icons
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

export const objStatusOrders = {
  1: {
    text: "Редактировать",
    img: <CreateOutlinedIcon sx={{ color: "#3788d8" }} />,
  },
  2: {
    text: "Заказ уже в разработке",
    img: <PendingActionsIcon sx={{ color: "#222" }} />,
  },
  3: {
    text: "Редактировать",
    img: <DoneOutlinedIcon sx={{ color: "rgb(16, 165, 16)" }} />,
  },
};
