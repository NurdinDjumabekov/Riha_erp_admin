import React from "react";
import { useNavigate } from "react-router-dom";
import { clearDataSave } from "../../store/reducers/saveDataSlice";
import { useDispatch } from "react-redux";

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clear = () => {
    dispatch(clearDataSave());
    navigate("/");
    window.location.reload();
  };

  return (
    <div>
      <button onClick={clear}>выйти</button>
    </div>
  );
};

export default SettingsPage;
