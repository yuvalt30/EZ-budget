import "./App.scss";
import Login from "./pages/Login/Login";
import InsertTransaction from "./pages/InsertTransaction/InsertTransaction";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Reflection from "./pages/Reflection/Reflection";
import Register from "./pages/Register/Register";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlanABudget from "./pages/PlanABudget/PlanABudget";
import Budget from "./pages/Budget/Budget";
import { useSelector } from "react-redux";
import Settings from "./pages/Settings/Settings";
import axios from "axios";
import AllTransactions from "./pages/AllTransactions/AllTransactions";
export const Data = createContext();
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    sectionsArr: [],
    data: {},
  });
  const { userRedux, user } = useSelector((state) => {
    return {
      userRedux: state.user,
      user: state.user,
    };
  });

  useEffect(() => {
    if (user) {
      navigate("/all-transactions", { replace: true });
      (async function () {
        const sectionData = await axios.get(
          "http://localhost:5000/users/sections",
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).accessToken
              }`,
            },
          }
        );
        setSections((p) => {
          return {
            ...p,
            sectionsArr: sectionData.data.map((value) => {
              return value._id;
            }),
            data: sectionData,
          };
        });
      })();
    } else navigate("/sign-in", { replace: true });
  }, [user]);

  return (
    <>
      <ToastContainer />
      <Data.Provider
        value={{
          user: userRedux,
          sectionsArr: sections.sectionsArr,
          data: sections.data,
        }}
      >
        <main>
          {location.pathname !== "/sign-in" && (
            <>
              <Sidebar
                user={
                  localStorage.getItem("user") &&
                  JSON.parse(localStorage.getItem("user"))
                }
              />
            </>
          )}

          <Routes>
            <Route path="/" element={<InsertTransaction />} />
            <Route path="/sign-in" element={<Login />} />

            {(user?.role === "admin" ||
              user?.role === "ceo" ||
              userRedux?.role === "admin" ||
              userRedux?.role === "ceo") && (
              <>
                <Route path="/budget" element={<PlanABudget />} />
                <Route path="/reflection" element={<Reflection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/plan-budget" element={<Budget />} />
                <Route path="/all-transactions" element={<AllTransactions />} />
              </>
            )}
          </Routes>
        </main>
      </Data.Provider>
    </>
  );
}

export default App;
