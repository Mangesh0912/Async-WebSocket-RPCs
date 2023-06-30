import React from "react";
import "../styles/App.css";

const StockList = (data) => {

  return (
    <div>
      <h2>Apple Stock Data</h2>
      <br/>
      <br/>
      <table className="table table-dark stocktable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>Close</th>
            <th>High</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.date}</td>
                <td>{val.open}</td>
                <td>{val.close}</td>
                <td>{val.high}</td>
                <td>{val.close}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
