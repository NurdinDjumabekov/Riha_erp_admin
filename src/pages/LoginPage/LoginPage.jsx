/////style
import "./style.scss";

//// helpers
import CLOUDS from "vanta/src/vanta.net";

////hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

////img
import logo from "../../assets/images/rihaLogo.png";
import { logInAccount } from "../../store/reducers/requestSlice";
import { myAlert } from "../../helpers/MyAlert";

////fns
// import { authLogin } from "../../store/reducers/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, setLogin] = useState({ login: "", password: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const sendLogIn = (e) => {
    e.preventDefault();
    dispatch(logInAccount({ data: login, navigate }));
    ////// логинизация
  };

  const changeInput = (e) => {
    if (e.target.value.includes("'") || e.target.value.includes("`")) {
      return;
    }
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    CLOUDS({
      el: "#vanta",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0x3f53ff,
      backgroundColor: 0x200d41,
    });
  }, []);

  return (
    <div className="vantaMain" id="vanta">
      <form onSubmit={sendLogIn}>
        <div className="blockLogo">
          <img src={logo} alt="logo" />
        </div>

        <input
          required
          placeholder="Логин"
          name="login"
          onChange={changeInput}
          value={login.login}
        />

        <input
          type="password"
          required
          placeholder="Пароль"
          name="password"
          onChange={changeInput}
          value={login.password}
        />

        <button className="actionLogin" type="submit">
          Войти
        </button>
        <div className="links">
          <p>Цифровые решения от: </p>
          <a href="https://www.333.kg/" target="_blank">
            www.333.kg
          </a>
        </div>

        <p>+996(555)-954-120 admin@333.kg</p>
        <p>+996(552)-708-701 altynsuleimankg@gmail.com</p>
        <p></p>
      </form>
    </div>
  );
};

export default LoginPage;
