import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import "./Dropdown.scss";
export const DropdownHead = ({ children, toggle, setToggle }) => {
  return (
    <div
      className="dropdown__select__header"
      onClick={() => setToggle(!toggle)}
    >
      <p>{children}</p>
      <Icon
        style={{
          transform: `rotate(${toggle ? 180 : 0}deg)`,
        }}
        icon="ep:arrow-down"
      />
    </div>
  );
};
export const DropdownSelect = ({ children, onClick }) => {
  return (
    <div className="dropdown__select" onClick={onClick}>
      {children}
    </div>
  );
};
export const DropdownOption = forwardRef(
  ({ children, onClick, value }, ref) => {
    return (
      <div
        value={value}
        onClick={onClick}
        className="dropdown__option"
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export const Dropdown = ({
  companyData,
  onChange,
  tittle,
  defaultValue,
  getIndex,
  ...rest
}) => {
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const componentRef = useRef();
  const [dropDownName, setDropDownName] = useState(
    defaultValue || "Select a section"
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    function handleClick(e) {
      if (componentRef && componentRef.current) {
        const ref = componentRef.current;
        if (!ref.contains(e.target)) {
          setDropdownToggle(false);
        }
      }
    }
    return () => document.removeEventListener("click", handleClick);
  }, []);
  useEffect(() => {
    setDropDownName(defaultValue);
  }, [defaultValue]);

  return (
    <div ref={componentRef} className="dropdown" {...rest}>
      <p style={{ marginBottom: 18 }}>{tittle}</p>
      <DropdownHead
        setToggle={setDropdownToggle}
        toggle={dropdownToggle}
        className="dropdown__select__header"
      >
        {dropDownName}
      </DropdownHead>
      {dropdownToggle && (
        <DropdownSelect onClick={() => setDropdownToggle(false)}>
          {companyData.map((value, i) => {
            return (
              <DropdownOption
                key={"a" + (i * 3) / 100}
                onClick={() => {
                  onChange && onChange(value);
                  getIndex && getIndex(i);
                  setDropDownName(value);
                }}
              >
                {value}
              </DropdownOption>
            );
          })}
        </DropdownSelect>
      )}
    </div>
  );
};
export default Dropdown;
