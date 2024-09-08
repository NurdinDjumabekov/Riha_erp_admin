import React from "react";
import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { changeAlertText } from "../../store/reducers/typesSlice";

const Alerts = () => {
  const dispatch = useDispatch();
  const { alertText } = useSelector((state) => state.typesSlice);
  const handleClose = () =>
    dispatch(changeAlertText({ ...alertText, state: false }));

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    zIndex: 999,
    height: 230,
    bgcolor: alertText.backColor,
    boxShadow: 24,
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 4,
  };

  React.useEffect(() => {
    setTimeout(() => {
      dispatch(
        changeAlertText({
          text: "",
          backColor: "",
          state: false,
        })
      );
    }, 2000);
  }, [alertText?.state]);

  const styleText = {
    color: "#222",
    fontFamily: "Gilroy",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "normal",
    textAlign: "center",
  };

  return (
    <Modal
      open={alertText.state}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <p style={styleText}>{alertText.text}</p>
      </Box>
    </Modal>
  );
};

export default Alerts;
