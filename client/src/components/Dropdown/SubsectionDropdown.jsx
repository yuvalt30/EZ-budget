import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import "./Dropdown.scss";
export const DropdownHead = ({ children, toggle, setToggle, style }) => {
  return (
    <div
      className="dropdown__select__header"
      onClick={() => setToggle(!toggle)}
    >
      <p style={style}>{children}</p>
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
  ({ children, onClick, value, ...rest }, ref) => {
    return (
      <div
        value={value}
        onClick={onClick}
        className="dropdown__option"
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export const SubsectionDropdown = ({
  companyData,
  onChange,
  tittle,
  onTitle,
}) => {
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const componentRef = useRef();
  const [dropDownName, setDropDownName] = useState("Select a section");
  const [color, setColor] = useState("#000");
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
  return (
    <div ref={componentRef} className="dropdown">
      <p style={{ marginBottom: 18 }}>{tittle}</p>
      <DropdownHead
        setToggle={setDropdownToggle}
        toggle={dropdownToggle}
        className="dropdown__select__header"
        style={{ color }}
      >
        {dropDownName}
      </DropdownHead>
      {dropdownToggle && (
        <DropdownSelect onClick={() => setDropdownToggle(false)}>
          {companyData[0].subSections.map((value, i) => {
            return (
              <DropdownOption
                key={"g" + (i * 3) / 100}
                s
                onClick={() => {
                  onChange({ id: value._id, name: value.subSection });
                  setDropDownName(value.subSection);
                  setColor(value.isIncome ? "#21c400" : "red");
                }}
                style={{ color: value.isIncome ? "#21c400" : "red" }}
              >
                {value.subSection}
              </DropdownOption>
            );
          })}
        </DropdownSelect>
      )}
    </div>
  );
};
export default SubsectionDropdown;
