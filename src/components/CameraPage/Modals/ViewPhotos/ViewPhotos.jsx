////// hooks
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

////// components
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import Slider from "react-slick";

////// style
import "./style.scss";
import { setActiveTTForPhoto } from "../../../../store/reducers/photoSlice";
import { getListPhotos } from "../../../../store/reducers/photoSlice";

////// helpers
import { transformLists } from "../../../../helpers/transformLists";
import { formatDateMonth } from "../../../../helpers/transformDate";

////// fns

////// icons

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewPhotos = (props) => {
  const { setViewPhotos, viewPhotos, setViewDate } = props;
  const dispatch = useDispatch();

  const { guid } = useSelector((state) => state.saveDataSlice?.dataSave);
  const { activeDateForPhotos } = useSelector((state) => state.photoSlice);
  const { activeTTForPhoto } = useSelector((state) => state.photoSlice);
  const { listPhotos } = useSelector((state) => state.photoSlice);
  const { listPointsEveryTA } = useSelector((state) => state.mapSlice);

  const [viewSlider, setViewSlider] = React.useState(false);
  const [slideIndex, setSlideIndex] = React.useState(0);

  const handleClose = () => {
    if (viewSlider) {
      setViewSlider(false);
      return;
    }
    setViewPhotos(false);
  };

  useEffect(() => {
    dispatch(getListPhotos({ activeDateForPhotos, guid, activeTTForPhoto }));
  }, [activeTTForPhoto]);

  const listTT = transformLists(listPointsEveryTA, "guid", "text");

  const onChangeCateg = (value) => dispatch(setActiveTTForPhoto(value));

  const openModalChoiceDate = () => {
    //// открываю модалку для выбора времени
    setViewDate(true);
    setViewPhotos(false);
  };

  const clickPhoto = (index) => {
    //// для просмотра каждой фотки
    setSlideIndex(index);
    setViewSlider(true);
  };

  //////////////////// Slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: slideIndex,
  };

  return (
    <Dialog
      fullScreen
      open={viewPhotos}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="viewPhotos">
        <div className="viewPhotos__inner">
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Галерея
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

        {viewSlider ? (
          <div className="mainSlider">
            <Slider {...settings}>
              {listPhotos?.map((i) => (
                <div>
                  <img src={i?.file_path} alt="###" />
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <>
            <div className="viewPhotos__selects">
              <div className="myInputs">
                <Select
                  options={listTT}
                  className="select"
                  onChange={onChangeCateg}
                  value={activeTTForPhoto}
                />
              </div>
              <div className="myInputs" onClick={() => setViewDate(true)}>
                <p onClick={openModalChoiceDate}>
                  {formatDateMonth(activeDateForPhotos)}
                </p>
              </div>
            </div>
            <div className="viewPhotos__main">
              {listPhotos?.map((i, index) => (
                <div onClick={() => clickPhoto(index)}>
                  <img src={i?.file_path} alt="###" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ViewPhotos;
