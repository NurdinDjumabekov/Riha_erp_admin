import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/////// fns
import { clearSelects } from "../../store/reducers/selectsSlice";
import { setListProduction } from "../../store/reducers/productionSlice";

////// components
import ListData from "../../components/ProductionPage/ListData/ListData";
import HistoryData from "../../components/ProductionPage/HistoryData/HistoryData";

////// style
import "./style.scss";

////// helpers
import { menuProduction } from "../../helpers/LocalData";

const ProductionPage = () => {
  const dispatch = useDispatch();

  const [active, setActive] = useState(1);

  useEffect(() => {
    return () => {
      dispatch(setListProduction([]));
      dispatch(clearSelects());
      //// при закрытии модалки очищаю списки
    };
  }, []);

  const obj = { 1: <ListData />, 2: <HistoryData /> };

  return (
    <>
      <div className="menuActions">
        {menuProduction?.map((i) => (
          <button
            className={i?.id == active ? "active" : ""}
            onClick={() => setActive(i.id)}
            key={i?.id}
          >
            {i?.icons}
            <p>{i?.name}</p>
          </button>
        ))}
      </div>
      <div className="productionPage">{obj?.[active]}</div>
    </>
  );
};

export default ProductionPage;
