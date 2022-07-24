import { Icon } from "@iconify/react";
import axios from "axios";
import { isEmpty } from "lodash";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Data } from "../../App";
import Dropdown from "../../components/Dropdown/Dropdown";
import SubsectionDropdown from "../../components/Dropdown/SubsectionDropdown";
import Input from "../../components/Input/Input";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success, Warn } from "../../utils/toasts";
import "./PlanABudget.scss";

export default function PlanABudget() {
  const [sections, setSections] = useState();
  const { sectionsArr, data, user } = useContext(Data);
  const [subSections, setSubSections] = useState();
  const [amount, setAmount] = useState(0);
  const [csvFile, setCsvFile] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [type, setType] = useState("Income");

  async function handleCsv(e) {
    // change to be for a format of [ subSection, sectionName, isIncome ]
    if (e.target.files[0].type === "text/csv") {
      setCsvFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = async (e) => {
        let text = e.target.result;
        let stripped = text.split("'").join("").split('"').join(""); // strip
        stripped.split("\r\n").forEach((line) => {
          let words = line.split("\t");
          if (words[0] && words[2]) {
            const obj = {
              sectionName: words[0],
              subSections: words[1],
              amount: words[2],
              year: words[3],
            };
            setCsvData((prev) => [...prev, obj]);
          }
        });
      };
      reader.readAsText(e.target.files[0]);
    } else {
      setCsvFile({ err: "Not a csv file" });
    }
  }
  async function sendCsv() {
    try {
      const response = await axios.post(
        "http://localhost:5000/transactions/file",
        {
          budget: csvData,
          isIncome: type === "Income" ? true : false,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setCsvFile({});
      Success("Completed");
      return response;
    } catch (err) {
      ERROR(err.response.data);
    }
  }
  const { isLoading: csvSending, refetch: sendCsvFile } = useQuery(
    "send-csv",
    sendCsv,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
  async function sendData() {
    if (!isEmpty(subSections) && sections && amount) {
      if (amount >= 0) {
        try {
          const response = await axios.put(
            `http://localhost:5000/sections/${subSections.id}-${amount}`,
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
      } else {
        Warn("Enter valid amount");
      }
    } else {
      Warn("Fill all the data");
    }
  }
  const { refetch, isLoading } = useQuery("register", sendData, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Preloader />;
  }
  if (csvSending) {
    return <Preloader />;
  }
  return (
    <div className="container plan_budget">
      <div className="form">
        <div>
          <Dropdown
            tittle={"Select section"}
            companyData={sectionsArr}
            onChange={(e) => {
              setSections(e);
            }}
          />
          {sections !== undefined && (
            <SubsectionDropdown
              tittle={"Select sub section"}
              onChange={(e) => {
                setSubSections(e);
              }}
              companyData={data.data.filter((value) => {
                return sections === value._id;
              })}
            />
          )}
          {subSections && (
            <Input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            >
              Monthly budget for {sections} of {subSections.name}
            </Input>
          )}
          <button
            onClick={() => {
              refetch();
            }}
          >
            Submit
          </button>
        </div>
        <hr className="divider" />
        <ol className="instruction">
          <li>
            Insert new budget to a sub section from the list of permitted
            section. Enter not negative number as amount. Optionally add a
            description and/or a date. (default date is today)
          </li>
          <li>
            another option is to upload a CSV file with transactions, where each
            line in file is a transaction.
          </li>
          <li>
            line's format: secA,sub1,sub2,sub3. <br />
            [first element is saction name, followed by its sub sections]
            <br />
            first will be the income sub sections, and then a line with '&',
            then outcome sub sections.
          </li>
        </ol>
      </div>

      <div>
        <Dropdown
          tittle={"Select type"}
          companyData={["Income", "Outcome"]}
          onChange={(e) => {
            setType(e);
          }}
          style={{
            minWidth: 300,
          }}
          defaultValue={"Income"}
        />

        <div className="csv_container">
          <div className="upload_file">
            <input type="file" onChange={handleCsv} />
            <Icon icon="ic:twotone-cloud-upload" />
            <p>Upload your CSV Here</p>
          </div>
          {csvFile.name ? (
            <>
              <div className="file_info">
                <Icon icon="fa6-solid:file-csv" />
                <div className="file_content">
                  <div>
                    <h2>{csvFile.name}</h2>
                  </div>
                  <Icon icon="flat-color-icons:ok" />
                </div>
              </div>
              <button onClick={sendCsvFile}>Submit</button>
            </>
          ) : csvFile.err ? (
            <div className="file_error">{csvFile.err}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
