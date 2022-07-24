import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import { DropdownHead, DropdownOption, DropdownSelect } from "./Dropdown";
import "./Dropdown.scss";

export const PermissionDropdown = ({ companyData, tittle, onChange }) => {
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const componentRef = useRef();
  const [options, setoptions] = useState([]);
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
      >
        Select a section
      </DropdownHead>
      {dropdownToggle && (
        <DropdownSelect>
          {companyData.map((value, i) => {
            return (
              <DropdownOption
                key={"a" + (i * 3) / 100}
                onClick={() => {
                  if (!options.includes(value)) {
                    setoptions((p) => {
                      return [...p, value];
                    });
                    onChange([...options, value]);
                  } else {
                    setoptions((p) =>
                      p.filter((old) => {
                        return old !== value;
                      })
                    );
                    onChange(
                      options.filter((old) => {
                        return old !== value;
                      })
                    );
                  }
                }}
                style
              >
                <p>{value}</p>
                {options.includes(value) && <Icon icon="akar-icons:check" />}
              </DropdownOption>
            );
          })}
        </DropdownSelect>
      )}
    </div>
  );
};
export default PermissionDropdown;
