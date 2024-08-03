import React from "react";

function MaintenanceTable({
  people,
  remarks,
  onRemarkChange,
  perDayCost,
  specialWorkPerPerson,
  daysInMonth,
}) {
  return (
    <table className="maintenance-table">
      <thead>
        <tr>
          <th>Flat Number</th>
          <th>Name</th>
          <th>Paid Balance</th>
          <th>Expenditure</th>
          <th>Special Work Per Person</th>
          <th>Total Payable Amount</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {people.map((person, index) => {
          const daysStayed =
            remarks[index] === "" ? daysInMonth : parseInt(remarks[index]) || 0;
          const expenditure = perDayCost * daysStayed;
          return (
            <tr key={index}>
              <td>{person.flatNumber}</td>
              <td>{person.name}</td>
              <td>Rs. 2000</td>
              <td>Rs. {expenditure.toFixed(2)}</td>
              <td>Rs. {specialWorkPerPerson.toFixed(2)}</td>
              <td>Rs. {(expenditure + specialWorkPerPerson).toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={remarks[index]}
                  onChange={(e) => onRemarkChange(index, e.target.value)}
                  placeholder="Enter days away"
                  min="0"
                  max="31"
                  step="1"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default MaintenanceTable;
