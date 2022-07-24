import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Preloader from "../../components/Preloader/Preloader";
import "../Reflection/Reflection.scss";
import Dropdown from "../../components/Dropdown/Dropdown";
import "./ALLTransactions.scss";
import PermissionDropdown from "../../components/Dropdown/PermissionDropdown";
export default function AllTransactions() {
  const [sectionName, setSectionName] = useState([]);

  const [subSectionName, setSubSectionName] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [sortOrder, setSortOrder] = useState("ASC");
  const fetchTransaction = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/transactions/`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const { data, isLoading } = useQuery(
    "all-transaction-data",
    fetchTransaction,
    {
      refetchOnWindowFocus: true,
    }
  );
  const date = new Date();
  useEffect(() => {
    if (!isLoading) {
      setTableData(data);
      const sectionNames = data.reduce((value, curr) => {
        !value.includes(curr.section.sectionName) &&
          value.push(curr.section.sectionName);
        return value;
      }, []);
      const subSectionNames = data.reduce((value, curr) => {
        !value.includes(curr.section.subSection) &&
          value.push(curr.section.subSection);
        return value;
      }, []);
      setSectionName(sectionNames);
      setSubSectionName(subSectionNames);
    }
  }, [data]);

  function sortData(type, key) {
    if (type === "text") {
      if (sortOrder === "ASC") {
        const sorted = [...tableData].sort((a, b) =>
          a.section[key].toLowerCase() > b.section[key].toLowerCase() ? 1 : -1
        );
        setTableData(sorted);
        setSortOrder("DSC");
      }
      if (sortOrder === "DSC") {
        const sorted = [...tableData].sort((a, b) =>
          a.section[key].toLowerCase() < b.section[key].toLowerCase() ? 1 : -1
        );
        setTableData(sorted);
        setSortOrder("ASC");
      }
    }

    if (type === "number") {
      if (sortOrder === "ASC") {
        const sorted = [...tableData].sort((a, b) => a[key] - b[key]);
        setTableData(sorted);
        setSortOrder("DSC");
      }
      if (sortOrder === "DSC") {
        const sorted = [...tableData].sort((a, b) => b[key] - a[key]);
        setTableData(sorted);
        setSortOrder("ASC");
      }
    }
  }
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="transaction-container">
        <div className="filter">
          <h4>Filter by</h4>
          <PermissionDropdown
            tittle={"Select a section"}
            companyData={sectionName}
            onChange={(e) => {
              setTableData(
                data.filter((value) => {
                  return e.includes(value.section.sectionName);
                })
              );
              setSubSectionName(
                data.reduce((value, curr) => {
                  e.includes(curr.section.sectionName) &&
                    !value.includes(curr.section.subSection) &&
                    value.push(curr.section.subSection);
                  return value;
                }, [])
              );
            }}
          />
          <PermissionDropdown
            tittle={"Select a sub sections"}
            companyData={subSectionName}
            onChange={(e) => {
              setTableData(
                data.filter((value) => {
                  return e.includes(value.section.subSection);
                })
              );
            }}
          />

          <button
            onClick={() => {
              setTableData(data);
            }}
          >
            Reset
          </button>
        </div>
        <div className="reflection all-transactions">
          <div className="section_table">
            <div className="table">
              <h2>All transactions Income</h2>

              <div className="fixTableHead">
                <table
                  align="center"
                  border={1}
                  cellSpacing={0}
                  cellPadding={5}
                >
                  <thead>
                    <tr>
                      <td
                        onClick={() => {
                          sortData("text", "sectionName");
                        }}
                      >
                        Section
                      </td>
                      <td
                        onClick={() => {
                          sortData("text", "subSection");
                        }}
                        className="subsection_data"
                      >
                        Sub Section
                      </td>
                      <td className="plan_budget_data">Amount</td>
                      <td className="execution">Description</td>
                      <td>Date</td>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((value, i) => {
                      return (
                        value.section.isIncome && (
                          <>
                            <tr key={"a" + i}>
                              <td>{value.section.sectionName}</td>
                              <td className="subsection_data">
                                {value.section.subSection}
                              </td>
                              <td className="plan_budget_data">
                                {value.amount}
                              </td>
                              <td className="execution">{value.description}</td>
                              <td>{date.toDateString(value.date)}</td>
                            </tr>
                          </>
                        )
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="section_table">
            <div className="table">
              <h2>All transactions Outcome</h2>

              <div className="fixTableHead">
                <table
                  align="center"
                  border={1}
                  cellSpacing={0}
                  cellPadding={5}
                >
                  <thead>
                    <tr>
                      <td
                        onClick={() => {
                          sortData("text", "sectionName");
                        }}
                      >
                        Section
                      </td>
                      <td
                        onClick={() => {
                          sortData("text", "subSection");
                        }}
                        className="subsection_data"
                      >
                        Sub Section
                      </td>
                      <td className="plan_budget_data">Amount</td>
                      <td className="execution">Description</td>
                      <td>Date</td>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((value, i) => {
                      return (
                        !value.section.isIncome && (
                          <>
                            <tr key={"a" + i}>
                              <td>{value.section.sectionName}</td>
                              <td className="subsection_data">
                                {value.section.subSection}
                              </td>
                              <td className="plan_budget_data">
                                {value.amount}
                              </td>
                              <td className="execution">{value.description}</td>
                              <td>{date.toDateString(value.date)}</td>
                            </tr>
                          </>
                        )
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
