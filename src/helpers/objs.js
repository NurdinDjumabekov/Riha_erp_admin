///////
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

///////
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

export const objStatusOrders = {
  0: {
    text: "Редактировать",
    img: <CreateOutlinedIcon sx={{ color: "#3788d8" }} />,
  },
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
    img: <DoneOutlinedIcon sx={{ color: "#1b5f20" }} />,
  },
};

export const objActionInvoice = {
  1: {
    text: "Сохранить",
    img: <AddOutlinedIcon sx={{ width: 16, height: 16 }} />,
  },
  2: {
    text: "Редактировать",
    img: <BorderColorOutlinedIcon sx={{ width: 16, height: 16 }} />,
  },
};
