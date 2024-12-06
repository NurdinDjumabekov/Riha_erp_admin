////// hooks
import React, { useState } from "react";
import { useRef } from "react";

///// icons
import ArrowIcon from "@mui/icons-material/ArrowForward";

////// components
import Slider from "react-slick";

////// style
import "./style.scss";

////// helpers
import { checkIsFile } from "../../../../helpers/validations";
import Modals from "../../../../common/Modals/Modals";

const EverySlide = ({ active, setActive }) => {
  console.log(active, "active");

  return (
    <Modals
      openModal={active?.guid}
      closeModal={() => setActive(false)}
      title={`Фото и видео отчёт`}
    >
      <div className="listFiles">
        {active?.files?.map((item, index) => (
          <div className="every">
            <a href={item?.file_path} target="_blank">
              <input type="checkbox" checked={true} />
              <p> Файл № {index + 1}</p>
            </a>
          </div>
        ))}
      </div>
    </Modals>
  );
};

export default EverySlide;
