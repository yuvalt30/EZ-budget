import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Data } from "../../App";
import Dropdown from "../../components/Dropdown/Dropdown";
import Input from "../../components/Input/Input";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success, Warn } from "../../utils/toasts";
import "./Register.scss";
import validator from "validator";
import PermissionDropdown, {
  RoleDropdown,
} from "../../components/Dropdown/PermissionDropdown";
export default function Register() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [permissions, setPermissions] = useState([]);

  const { user } = useContext(Data);
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  async function sendData() {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        { ...input, permissions },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      Success("Completed");
      return response;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  async function getSections() {
    try {
      const response = await axios.get("http://localhost:5000/sections/names", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      ERROR(err.response.data);
    }
  }
  const { data, isLoading } = useQuery("get-sections-name", getSections, {
    refetchOnWindowFocus: false,
  });
  const {
    refetch,
    status,
    isLoading: registerFetching,
  } = useQuery("register", sendData, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  function registerUser() {
    let empty;
    for (var key in input) {
      if (input[key] === "") {
        empty = true;
        break;
      }
    }
    if (empty) {
      Warn("Fill all data");
    } else {
      if (user.role === "admin" && !permissions[0]) {
        Warn("Fill all data");
      } else if (!validator.isEmail(input.email)) {
        Warn("Provide valid email");
      } else {
        refetch();
      }
    }
  }

  if (registerFetching) {
    return <Preloader />;
  }
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <div className="container register">
      <div className="sign-up-container">
        <div className="form">
          <h1>Register an employee</h1>
          <span>provide your information for registration</span>
          <Input
            name="name"
            value={input.name}
            type="text"
            onChange={handleChange}
          >
            Name
          </Input>
          <Input
            name="email"
            type="email"
            value={input.email}
            onChange={handleChange}
          >
            Email
          </Input>
          <PermissionDropdown
            tittle={"Permissions"}
            companyData={data.data}
            onChange={(e) => {
              setPermissions(e);
            }}
          />
          <Input
            name="password"
            type="password"
            value={input.password}
            onChange={handleChange}
          >
            Password
          </Input>
          {user.role === "admin" && (
            <Dropdown
              tittle={"Role"}
              defaultValue={"Select a role"}
              companyData={["employee", "ceo"]}
              onChange={(e) => {
                setInput({ ...input, role: e });
              }}
            />
          )}
          <button onClick={registerUser}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
