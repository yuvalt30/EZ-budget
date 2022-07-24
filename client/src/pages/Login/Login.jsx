import React, { useEffect, useLayoutEffect, useState } from "react";
import "./Login.scss";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success } from "../../utils/toasts";
import { useDispatch } from "react-redux";
import { budgetActions } from "../../store";

export default function Login() {
  const [load, setLoad] = useState(false);
  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  function handleSignIn(e) {
    setSignIn({ ...signIn, [e.target.name]: e.target.value });
  }
  const dispatch = useDispatch();
  async function signInCall() {
    try {
      setLoad(true);
      const data = await axios.post(
        "http://localhost:5000/users/login",
        signIn
      );
      localStorage.setItem("user", JSON.stringify(data.data));
      dispatch(budgetActions.user(data.data));
      navigate("/all-transactions", { replace: true });
      // const sectionData = await axios.get(
      //   "http://localhost:5000/users/sections",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${data.data.accessToken}`,
      //     },
      //   }
      // );
      // const sectionsArr = sectionData.data.map((value) => {
      //   return value._id;
      // });

      // );
      setLoad(false);
    } catch (err) {
      setLoad(false);
      ERROR(err.response.data);
    }
  }
  if (load) {
    return <Preloader />;
  }
  return (
    <div className="login">
      <div className="form-container sign-in-container">
        <div className="form">
          <h1>Sign in</h1>
          <input
            onChange={handleSignIn}
            name="email"
            type="email"
            placeholder="Email"
          />
          <input
            onChange={handleSignIn}
            type="password"
            placeholder="Password"
            name="password"
          />
          {/* <a href="#">Forgot your password?</a> */}
          <button onClick={signInCall}>Sign In</button>
        </div>
      </div>
    </div>
  );
}
