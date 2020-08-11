import React from "react";
import "./Table.css";

const Table = ({ slice }) => {
  console.log(slice);
  // if (slice.primary.header)
  const headers = slice.primary.header[0].text.split(",");
  // if (slice.items)
  const rows = slice.items.map((item) => item.row[0].text.split(","));

  return (
    <div className="container">
      <table>
        <thead>
          {headers.map((item) => (
            <th>{item}</th>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
                {row.map((item) => (
                  <td>{item}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
