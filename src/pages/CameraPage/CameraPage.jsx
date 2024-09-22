import React, { useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

/////// components
import ViewPhotos from "../../components/CameraPage/Modals/ViewPhotos/ViewPhotos";
import ChoiceDateForPhotos from "../../components/CameraPage/Modals/ChoiceDateForPhotos/ChoiceDateForPhotos";
import Webcam from "react-webcam";
import Select from "react-select";

/////// style
import "./style.scss";

////// icons
import restart from "../../assets/icons/arrow-repeat.svg";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";

////// fns
import { getListPhotos, sendPhotos } from "../../store/reducers/photoSlice";
import { setActiveTTForPhoto } from "../../store/reducers/photoSlice";

////// helpers
import { transformLists } from "../../helpers/transformLists";
import { myAlert } from "../../helpers/MyAlert";

const CameraPage = () => {
  const dispatch = useDispatch();

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraFront, setCameraFront] = useState(true);
  const [viewPhotos, setViewPhotos] = useState(false);
  const [viewDate, setViewDate] = useState(false);
  const [animation, setAnimation] = useState(false);

  const { dataSave } = useSelector((state) => state.saveDataSlice);
  const { listPointsEveryTA } = useSelector((state) => state.mapSlice);
  const { activeTTForPhoto } = useSelector((state) => state.photoSlice);
  const { activeDateForPhotos } = useSelector((state) => state.photoSlice);

  const createPhoto = () => {
    if (!!!activeTTForPhoto?.guid) {
      myAlert("Выберите торговую точку!", "error");
      return;
    }

    sendPhoto();
  };

  const sendPhoto = useCallback(() => {
    setAnimation(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Преобразуем base64 в файл PNG
      const file = base64ToFile(imageSrc, "photo.png");

      const formData = new FormData();
      formData?.append("agent_guid", dataSave?.guid);
      formData?.append("point_guid", activeTTForPhoto?.guid);
      formData?.append("file", file);
      dispatch(sendPhotos({ data: formData }));
    }

    setTimeout(() => {
      setAnimation(false);
    }, 200);
  }, [webcamRef, activeTTForPhoto?.guid]);

  const listTT = transformLists(listPointsEveryTA, "guid", "text");

  const onChangeCateg = (value) => dispatch(setActiveTTForPhoto(value));

  const handleButtonClick = () => {
    if (!!!activeTTForPhoto?.guid) {
      myAlert("Выберите торговую точку!", "error");
      return;
    }

    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (!!!activeTTForPhoto?.guid) {
      myAlert("Выберите торговую точку!", "error");
      return;
    }
    const file = e?.target?.files;
    if (file) {
      const formData = new FormData();
      formData?.append("agent_guid", dataSave?.guid);
      formData?.append("point_guid", activeTTForPhoto?.guid);
      formData?.append("file", file?.[0]); /// check
      dispatch(sendPhotos({ data: formData }));
    }
  };

  const viewAllPhotos = () => {
    //// открываю модалку для просмотра всех фото
    setViewPhotos(true);

    ///// get  всех фото
    const obj = { activeDateForPhotos, guid: dataSave?.guid, activeTTForPhoto };
    dispatch(getListPhotos(obj));
  };

  return (
    <div className="cameraPage">
      <div className="cameraPage__inner">
        <div className="loadFiles">
          <div className="myInputs">
            <h6>Торговые точки</h6>
            <Select
              options={listTT}
              className="select"
              onChange={onChangeCateg}
              value={activeTTForPhoto}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleFileChange}
            multiple
            style={{ display: "none" }}
          />

          {/* Кнопка для открытия окна выбора файла */}
          <button onClick={handleButtonClick}>
            <DownloadIcon sx={{ color: "#222" }} />
          </button>
        </div>
        <Webcam
          audio={false} // Отключаем звук, так как мы снимаем только фото
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{
            facingMode: cameraFront ? "user" : { exact: "environment" },
          }}
          mirrored={cameraFront} // Отражение фронтальной камеры
        />
      </div>

      <div className="photoSettings">
        <button className="chageCamera" onClick={viewAllPhotos}>
          <RemoveRedEyeIcon sx={{ color: "#fff" }} />
        </button>
        <button onClick={createPhoto} className="createPhoto"></button>
        <button
          onClick={() => setCameraFront(!cameraFront)}
          className="chageCamera"
        >
          <img src={restart} alt="()" />
        </button>
      </div>

      <div className={animation ? "clickPhoto" : ""}></div>
      <ViewPhotos
        viewPhotos={viewPhotos}
        setViewPhotos={setViewPhotos}
        setViewDate={setViewDate}
      />
      <ChoiceDateForPhotos
        viewPhotos={viewPhotos}
        setViewPhotos={setViewPhotos}
        setViewDate={setViewDate}
        viewDate={viewDate}
      />
    </div>
  );
};

export default CameraPage;

const base64ToBlob = (base64Data, contentType = "image/png") => {
  const byteCharacters = atob(base64Data.split(",")[1]); // Убираем префикс 'data:image/png;base64,'
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const base64ToFile = (base64Data, filename) => {
  const blob = base64ToBlob(base64Data);
  return new File([blob], filename, { type: "image/png" });
};
