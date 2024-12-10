////// hooks
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

///// icons

////// components
import ReportRealization from "../../../ReportsAgentPages/ReportRealization/ReportRealization";
import GraphicsProds from "../../../ReportsAgentPages/GraphicsProds/GraphicsProds";

////// style
import "./style.scss";

////// helpers
import Modals from "../../../../common/Modals/Modals";

const ActionsPoints = (props) => {
  const { active, setActive, table, setTable } = props;

  if (active?.guid) {
    return (
      <Modals
        openModal={true}
        closeModal={() => setActive(false)}
        title={`Фото и видео отчёт`}
      >
        <div className="listFiles">
          {active?.files?.map((item, index) => (
            <div className="every">
              <a href={item?.file_path} target="_blank">
                <input type="checkbox" checked={true} />
                <p>Файл № {index + 1}</p>
              </a>
            </div>
          ))}
        </div>
      </Modals>
    );
  }

  if (table?.guid) {
    return (
      <div className="listsProdsPoints">
        <Modals
          openModal={true}
          closeModal={() => setTable({ rel: [], ret: [], guid: "" })}
          title={`Торговая точка: ${table?.point}`}
        >
          <div className="listProds listsProdsPoints__inner">
            <ReportRealization list={table?.rel} title={`Реализация`} />
            <ReportRealization list={table?.ret} title={`Возврат`} />
          </div>
          <div className="graphisc">
            <GraphicsProds list={table?.rel} />
          </div>
        </Modals>
      </div>
    );
  }
};

export default ActionsPoints;
