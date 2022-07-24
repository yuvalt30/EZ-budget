import { Icon } from "@iconify/react";
import React, { useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
export default function Sidebar({ user }) {
  const navigate = useNavigate();

  const logOut = useCallback(() => {
    localStorage.setItem("user", null);
    navigate("/sign-in");
  }, []);

  return (
    <div className="navigation">
      <ul>
        <li className="header-nav">
          <span className="title">Welcome,</span>
          <h3>{user?.name}</h3>
          <span>
            Role: <b>{user?.role}</b>
          </span>
        </li>
        {(user?.role === "ceo" || user?.role === "admin") && (
          <>
            <li>
              <NavLink to="/all-transactions">
                <Icon icon="el:graph-alt" />
                <span className="title">All transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/reflection">
                <Icon icon="el:graph-alt" />
                <span className="title">Reflection</span>
              </NavLink>
            </li>
            <div className="nav_divider"></div>
            <li>
              <NavLink to="/budget">
                <Icon icon="mdi:account-cash-outline" />
                <span className="title">Plan a Budget</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/register">
                <Icon icon="carbon:data-enrichment-add" />
                <span className="title">Register</span>
              </NavLink>
            </li>
            <div className="nav_divider"></div>
          </>
        )}
        <li>
          <NavLink to="/">
            <Icon icon="fluent:cube-rotate-20-filled" />
            <span className="title">Insert transactions</span>
          </NavLink>
        </li>
        {(user?.role === "ceo" || user?.role === "admin") && (
          <li>
            <NavLink to="/plan-budget">
              <Icon icon="carbon:heat-map-02" />
              <span className="title">Create section</span>
            </NavLink>
          </li>
        )}
      </ul>
      <button onClick={logOut}>
        <span className="title">Log out</span>
      </button>
    </div>
  );
}
