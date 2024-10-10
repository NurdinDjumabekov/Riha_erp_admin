import MainRoutes from "./routers/MainRoutes";
import "react-toastify/dist/ReactToastify.css";

/////// hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/////// style
// import "./assets/fonts/Montserrat/stylesheet.css";
import "./assets/fonts/Nunito_sans/stylesheet.css";

const App = () => {
  const dispatch = useDispatch();

  return <MainRoutes />;
};

export default App;
