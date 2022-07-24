import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { budgetActions } from "../../store";
import { monthNo } from "./Reflection";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { ERROR } from "../../utils/toasts";
import { useQuery } from "react-query";

const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function SubSectionOutcome({ setShow, data, monthIndex }) {
  const [monthAVG, setMonthAVG] = useState(0);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState(0);
  const [chartsI, setChartsI] = useState([]);
  const dispatch = useDispatch();
  const [showChartsI, setShowChartsI] = useState(false);
  const [secName, setSecName] = useState([]);
  const { selectedSec } = useSelector((state) => {
    return {
      selectedSec: state.lineData.name,
    };
  });

  useEffect(() => {
    let percentageSum = 0;
    const percentChart = [];
    data.outcome.forEach((value) => {
      for (let i = 0; i <= monthIndex; i++) {
        percentageSum += value.outcome[i];
      }
      percentChart.push(
        monthTotal !== 0 && value.outcomeBudget
          ? (value.outcomeBudget / monthTotal) * 100
          : 0
      );
    });
    setChartsI(percentChart);
    const monthAVGSum = percentageSum / (monthIndex + 1);
    const varMonth = String(monthAVGSum).includes(".")
      ? monthAVGSum.toFixed(2)
      : monthAVGSum;
    setMonthAVG(varMonth);
    setPerformanceTotal(percentageSum);
    dispatch(
      budgetActions.summary({
        outcome: {
          avg: Number(varMonth),
          performance: Number(percentageSum),
        },
      })
    );
  }, [monthIndex, monthTotal]);

  useEffect(() => {
    const monthBudget = [];
    let monthSumTotal = 0;
    const secNameArr = [];
    data.outcome.forEach((value, i) => {
      monthBudget.push(value.outcome);
      secNameArr.push(value.section);
      monthSumTotal += value.outcomeBudget;
    });
    setSecName(secNameArr);
    setMonthTotal(monthSumTotal);
    setMonthSum(monthBudget.reduce((r, a) => r.map((b, i) => a[i] + b)));
  }, []);

  const id = useId();
  const dataOutcome = {
    labels: secName,
    datasets: [
      {
        label: "# of Votes",
        data: chartsI,

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(172, 255, 64, 0.2)",
          "rgba(64, 195, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "#66fff2",
          "#ef40ff",
          "#9940ff",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <>
      <div className="table">
        <div className="sub-section-title">
          <h2>outcome of {selectedSec}</h2>
          <button
            onClick={() => {
              setShowChartsI(true);
            }}
          >
            Chart
          </button>
        </div>
        {showChartsI && (
          <div className="charts">
            <div>
              <div>
                <h2>outcome</h2>
                <Pie data={dataOutcome} />
              </div>
            </div>
            <button
              onClick={() => {
                setShowChartsI(false);
              }}
            >
              Close
            </button>
          </div>
        )}
        <div className="fixTableHead">
          <table align="center" border={1} cellSpacing={0} cellPadding={5}>
            <thead>
              <tr>
                <td>outcome</td>
                <td className="plan_budget_data" colSpan={3}>
                  Planned Budget
                </td>
                <td className="execution" colSpan={3}>
                  Execution in reality
                </td>
                {monthPercentage.map((value, i) => {
                  return i <= monthIndex && <td>{value}%</td>;
                })}
              </tr>

              <tr>
                <td>Section</td>
                <td className="plan_budget_data">Monthly</td>
                <td className="plan_budget_data">Yearly</td>
                <td className="plan_budget_data">Percentage</td>
                <td className="execution">Percentage</td>
                <td className="execution">Performance</td>
                <td className="execution">Month avg</td>
                {monthNo.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td key={value} className="monthly_budget">
                        {value}
                      </td>
                    )
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.outcome.map((value, i) => {
                let sum = 0;
                for (let i = 0; i <= monthIndex; i++) {
                  sum += value.outcome[i];
                }
                return (
                  <Row
                    value={value}
                    total={{ monthTotal }}
                    data={data.outcome}
                    setShow={setShow}
                    performance={sum}
                    i={i}
                    key={"a" + i * 2}
                    monthIndex={monthIndex}
                  />
                );
              })}
              <tr style={{ fontWeight: 600 }}>
                <td style={{ textDecoration: "none" }}>Total</td>
                <td className="plan_budget_data">{monthTotal}</td>
                <td className="plan_budget_data">{monthTotal * 12}</td>
                <td className="plan_budget_data">100%</td>
                <td className="execution"></td>
                <td className="execution">{performanceTotal}</td>
                <td className="execution">{monthAVG}</td>
                {monthSum.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td key={id} className="monthly_budget">
                        {value}
                      </td>
                    )
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Row({ setShow, value, total, monthIndex, performance }) {
  const [percentage, setPercentage] = useState(0);
  const [monthAVG, setMonthAVG] = useState(0);
  const dispatch = useDispatch();
  async function getReflection() {
    try {
      const res = await axios.get(
        `http://localhost:5000/tracks/predict?name=${value.section}`,
        {
          data: value.income,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery("predict" + value.section + "subO", getReflection, {
    refetchOnWindowFocus: false,
    enabled: false,
  });
  useEffect(() => {
    setMonthAVG(performance / (monthIndex + 1));

    value.outcomeBudget !== 0 &&
      setPercentage((performance / (value.outcomeBudget * 12)) * 100);
  }, [monthIndex]);
  return (
    <tr>
      <td
        onClick={() => {
          setShow("show-sub-date");
          dispatch(
            budgetActions.selectedSub({ name: value.section, subId: value._id })
          );
        }}
      >
        {value.section}
      </td>
      <td className="plan_budget_data">{value.outcomeBudget}</td>
      <td className="plan_budget_data">
        {Number(value.outcomeBudget) > 0 ? (
          value.outcomeBudget * 12
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td className="plan_budget_data">
        {total.totalMonth !== 0 && value.outcomeBudget ? (
          ((value.outcomeBudget / total.monthTotal) * 100).toFixed(2) + "%"
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td
        className={`execution ${
          percentage > monthPercentage[monthIndex] ? "alert" : ""
        }`}
      >
        {percentage.toFixed(2)}%
      </td>
      <td className="execution">{performance}</td>
      <td className="execution">{Math.round(monthAVG)}</td>

      {value.outcome.map((month, i, arr) => {
        return (
          i <= monthIndex && (
            <td
              key={month}
              className={`monthly_budget ${
                month > value.outcomeBudget ? "alert" : ""
              }`}
            >
              {month}
            </td>
          )
        );
      })}
      <td>
        {!data?.data?.prediction && (
          <button onClick={refetch}>
            {isLoading ? "Loading" : <Icon icon="bx:show" />}
          </button>
        )}
        {data?.data?.name === value.section && <p>{data?.data?.prediction}</p>}
      </td>
    </tr>
  );
}
