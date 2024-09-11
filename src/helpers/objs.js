///////
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";

///////
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

///////
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

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
    img: <LibraryAddIcon sx={{ width: 16, height: 16 }} />,
  },
  2: {
    text: "Редактировать",
    img: <BorderColorOutlinedIcon sx={{ width: 16, height: 16 }} />,
  },
};

export const listActionsTitle = [
  {
    id: 1,
    name: "Список товаров",
    img: <ContentPasteSearchOutlinedIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: (
      <ContentPasteSearchOutlinedIcon sx={{ color: "#1976d2", width: 16 }} />
    ),
  },
  {
    id: 2,
    name: "Ингредиенты",
    img: <ChecklistRtlIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: <ChecklistRtlIcon sx={{ color: "#1976d2", width: 16 }} />,
  },
  {
    id: 3,
    name: "Замесы",
    img: <EventRepeatIcon sx={{ color: "#fff", width: 16 }} />,
    imgActive: <EventRepeatIcon sx={{ color: "#1976d2", width: 16 }} />,
  },
];
