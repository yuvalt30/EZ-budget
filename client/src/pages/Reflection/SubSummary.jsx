import React from "react";

import { useSelector } from "react-redux";

export default function SubSummary({ setShow, data = [], monthIndex }) {
  const summary = useSelector((state) => state.summary);

  return (
    <>
      <div className="table">
        <h2>summary</h2>
        <div className="fixTableHead">
          <table align="center" border={1} cellSpacing={0} cellPadding={5}>
            <thead>
              <tr>
                <td>Section</td>
                <td className="plan_budget_data">Month avg</td>
                <td className="execution">Performance</td>
                {data.summary.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td key={"c" + i} className="monthly_budget">
                        {i + 1}
                      </td>
                    )
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Section</td>
                <td className="plan_budget_data">
                  {(summary.income.avg - summary.outcome.avg).toFixed(2)}
                </td>
                <td className="execution">
                  {summary.income.performance - summary.outcome.performance}
                </td>
                {data?.summary.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td className="monthly_budget">{value}</td>
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
