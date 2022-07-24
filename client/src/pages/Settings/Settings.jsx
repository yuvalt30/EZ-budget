import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import Dropdown from "../../components/Dropdown/Dropdown";
import Preloader from "../../components/Preloader/Preloader";
import { budgetActions } from "../../store";
import { ERROR, Success } from "../../utils/toasts";
import "./Settings.scss";

export default function Settings() {
  const months = ["January", "September"];
  const dispatch = useDispatch();
  const [showStart, setShowStart] = useState(false);
  async function sendMonth() {
    try {
      const res = await axios.get(`http://localhost:5000/users/${month}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
      Success("Completed");
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  const { isLoading, refetch } = useQuery("send-month", sendMonth, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  const [month, setMonth] = useState("");
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <div className="setting">
      {showStart && (
        <div>
          <div>
            <Icon
              icon="fa:close"
              onClick={() => {
                setShowStart(false);
              }}
            />
            <Dropdown
              tittle={"Start From"}
              companyData={["January", "September"]}
              getIndex={(e) => {
                setMonth(e === 1 ? 8 : 0);
              }}
              defaultValue={"Starts from"}
            />
            {month.length !== 0 && <button onClick={refetch}>Submit</button>}
          </div>
        </div>
      )}
      <Icon
        onClick={() => {
          setShowStart(true);
        }}
        icon="ant-design:setting-filled"
      />
    </div>
  );
}
