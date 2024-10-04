/////// hooks
import { useSelector } from "react-redux";
import { useState } from "react";

////// components
import { BottomSheet } from "react-spring-bottom-sheet";
import { NavLink, useNavigate } from "react-router-dom";

////// imgs
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "../../../assets/MyIcons/AddIcon";
import MenuIcon from "@mui/icons-material/Menu";
import iconNav from "../../../assets/icons/arrowMapNav.svg";
import AddHomeIcon from "@mui/icons-material/AddBusiness";

////// helpers
import { myAlert } from "../../../helpers/MyAlert";
import { listActionsMap } from "../../../helpers/objs";

/////// style
import "./style.scss";

const ActionsMapStatus = ({ startEndListRoute, setCloseRoute, searchMeFN }) => {
  const navigate = useNavigate();

  const { activeRouteList } = useSelector((state) => state.photoSlice);

  const [look, setLook] = useState(false);

  const routeEnd = () => myAlert("Вы обошли все точки на сегодня");

  const obj = {
    0: (
      <button className="start" onClick={() => startEndListRoute(1)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Начать путь</p>
      </button>
    ),
    1: (
      <button className="start end" onClick={() => setCloseRoute(true)}>
        <AddIcon width={16} height={16} color={"#fff"} />
        <p>Завершить маршрут</p>
      </button>
    ),
    2: (
      <button className="start nice" onClick={routeEnd}>
        <CheckIcon width={16} height={16} color={"#222"} />
      </button>
    ),
  };

  const clickAction = ({ link }) => {
    navigate(link);
    setLook(false);
  };

  return (
    <>
      {!look && (
        <button className="btnNavMap" onClick={() => searchMeFN()}>
          <img src={iconNav} alt=">" />
        </button>
      )}

      {obj?.[activeRouteList?.status]}
      <div className="actionsMapStatus" onClick={() => setLook(true)}>
        <MenuIcon />
      </div>

      <BottomSheet
        open={look}
        onDismiss={() => setLook(false)}
        defaultSnap={({ maxHeight }) => maxHeight * 0.8}
        snapPoints={({ maxHeight }) => maxHeight * 0.8}
      >
        <div className="actionsMapMenu">
          {listActionsMap?.map((i) => (
            <div
              style={{ background: i?.color }}
              onClick={() => clickAction(i)}
            >
              {i?.icon}
              <p>{i?.name}</p>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
};

export default ActionsMapStatus;
