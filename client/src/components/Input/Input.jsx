import React from "react";
import "./Input.scss";
export default function Input({ children, type, error, ...rest }) {
  return (
    <div className="input">
      <p>{children}</p>
      <input
        className={error ? "error" : null}
        {...rest}
        type={type || "text"}
        placeholder={type === "date" ? "dd-mm-yyyy" : ""}
      />
    </div>
  );
}
