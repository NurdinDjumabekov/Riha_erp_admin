///////
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import HourglassEmptyIcon from "@mui/icons-material/Cached";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

///////
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

///////
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";

/////// icons
import HomeOutlinedIcon from "@mui/icons-material/FormatListNumbered";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AvTimerOutlinedIcon from "@mui/icons-material/AvTimerOutlined";
import ChecklistIcon from "@mui/icons-material/Checklist";

export const objStatusOrders = {
  0: {
    text: "Редактировать",
    img: <CreateOutlinedIcon sx={{ color: "#3788d8" }} />,
  },
  "-2": {
    text: "Идёт подготовка к производству, редактирование невозможно!",
    img: <HourglassEmptyIcon sx={{ color: "#222" }} />,
  },
  1: {
    text: "Заявка уже в производстве",
    img: <PendingActionsIcon sx={{ color: "#222" }} />,
  },
  2: {
    text: "Товары на складе и готовы к отгрузке",
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

export const objStatusText = {
  1: "Товар добавлен!",
  2: "Товар обновлён!",
};

export const listMenu = [
  {
    id: 4,
    title: "Производство",
    icon: <AvTimerOutlinedIcon sx={{ color: "#fff" }} />,
    iconActive: <AvTimerOutlinedIcon sx={{ color: "#988c7d" }} />,
    link: "/",
  },
  {
    id: 5,
    title: "Склад готовой продукции",
    icon: <HomeWorkIcon sx={{ color: "#fff" }} />,
    link: "/",
  },
  {
    id: 6,
    title: "Торговые агенты",
    icon: <ChecklistIcon sx={{ color: "#fff" }} />,
    link: "/all_agents",
  },
  {
    id: 10,
    title: "Настройки",
    icon: <SettingsSuggestOutlinedIcon sx={{ color: "#fff" }} />,
    link: "/asd",
  },
  {
    id: 15,
    title: "Отчеты",
    icon: <SummarizeOutlinedIcon sx={{ color: "#fff" }} />,
    link: "/asd",
  },
  {
    id: 26,
    title: "Справочники",
    icon: <AccountTreeOutlinedIcon sx={{ color: "#fff" }} />,
    link: "/as",
  },
];
