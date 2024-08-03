import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";

// Sample data for 15 people and their flat numbers
const people = [
  { name: "John Doe", flatNumber: "101" },
  { name: "Jane Smith", flatNumber: "102" },
  { name: "Alice Johnson", flatNumber: "103" },
  { name: "Bob Brown", flatNumber: "104" },
  { name: "Charlie Davis", flatNumber: "105" },
  { name: "Diana Evans", flatNumber: "106" },
  { name: "Edward Foster", flatNumber: "107" },
  { name: "Fiona Green", flatNumber: "108" },
  { name: "George Harris", flatNumber: "109" },
  { name: "Hannah Ivers", flatNumber: "110" },
  { name: "Ian Jackson", flatNumber: "111" },
  { name: "Jessica Kelly", flatNumber: "112" },
  { name: "Kevin Lee", flatNumber: "113" },
  { name: "Laura Miller", flatNumber: "114" },
  { name: "Mike Nelson", flatNumber: "115" },
];

function App() {
  const [expenses, setExpenses] = useState([
    { taskName: "", amount: 0, description: "" },
  ]);

  const [specialWork, setSpecialWork] = useState(5000);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [remarks, setRemarks] = useState(Array(people.length).fill(""));

  // Calculate the number of days in the selected month and year
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedDate);

  const handleAddExpense = () => {
    setExpenses([...expenses, { taskName: "", amount: 0, description: "" }]);
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] =
      field === "amount" ? parseFloat(value) || 0 : value;
    setExpenses(newExpenses);
  };

  const handleRemarkChange = (index, value) => {
    const validValue =
      value === "" ||
      (/^[0-9\b]+$/.test(value) &&
        parseInt(value) >= 0 &&
        parseInt(value) <= 31)
        ? value
        : remarks[index];
    const newRemarks = [...remarks];
    newRemarks[index] = validValue;
    setRemarks(newRemarks);
  };

  const calculateTotalAmount = () => {
    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return totalExpenses;
  };

  const calculatePerDayCost = () => {
    const total = calculateTotalAmount();
    const peopleWithNoRemarks = remarks.filter(
      (remark) => remark === ""
    ).length;
    const totalDaysStayed = remarks.reduce((total, remark) => {
      const days = remark !== "" ? parseInt(remark) : 0 || 0;
      return total + days;
    }, 0);
    const totalDays = totalDaysStayed + peopleWithNoRemarks * daysInMonth;
    return totalDays > 0 ? total / totalDays : 0;
  };

  const perDayCost = calculatePerDayCost();
  const specialWorkPerPerson = specialWork / people.length;

  const generatePDF = () => {
    const doc = new jsPDF();
    const heading = `Maintenance Calculation for ${selectedDate.toLocaleString(
      "default",
      { month: "long" }
    )} ${selectedDate.getFullYear()}`;

    doc.setFontSize(16);
    doc.text(heading, 10, 10);

    doc.setFontSize(12);
    doc.text("Expenses List:", 10, 20);

    // Table for Expenses List
    doc.autoTable({
      head: [["Task Name", "Amount", "Description"]],
      body: expenses.map((expense) => [
        expense.taskName,
        `$${expense.amount.toFixed(2)}`,
        expense.description,
      ]),
      startY: 30,
      margin: { top: 10 },
    });

    let y = doc.autoTable.previous.finalY + 10; // Adjust starting position for next section

    doc.text(`Special Work: $${specialWork.toFixed(2)}`, 10, y);
    y += 10;

    // Total Amount
    doc.text(
      `Total Amount: $${calculateTotalAmount() + specialWork}`,
      10,
      y + 10
    );
    y += 20;

    // Table for Main Data
    doc.autoTable({
      head: [
        [
          "Flat Number",
          "Name",
          "Paid Balance",
          "Expenditure",
          "Special Work Per Person",
          "Total Payable Amount",
          "Remarks",
        ],
      ],
      body: people.map((person, index) => {
        const daysStayed =
          remarks[index] === "" ? daysInMonth : parseInt(remarks[index]) || 0;
        const expenditure = perDayCost * daysStayed;
        return [
          person.flatNumber,
          person.name,
          "Rs. 2000", // This is a hardcoded value; replace it with actual data if necessary
          `Rs. ${expenditure.toFixed(2)}`,
          `Rs. ${specialWorkPerPerson.toFixed(2)}`,
          `Rs. ${(expenditure + specialWorkPerPerson).toFixed(2)}`,
          remarks[index] || "N/A",
        ];
      }),
      startY: y,
      margin: { top: 10 },
    });

    doc.save("maintenance-calculation.pdf");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Maintenance Calculation for{" "}
          {selectedDate.toLocaleString("default", { month: "long" })}{" "}
          {selectedDate.getFullYear()}
        </h1>
        <div>
          <label>
            Maintenance for:
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
            />
          </label>
        </div>
        <div>
          <h2>Expenses</h2>
          {expenses.map((expense, index) => (
            <div key={index} className="expense-entry">
              <input
                type="text"
                placeholder="Task Name"
                value={expense.taskName}
                onChange={(e) =>
                  handleExpenseChange(index, "taskName", e.target.value)
                }
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) =>
                  handleExpenseChange(index, "amount", e.target.value)
                }
                min="0"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={expense.description}
                onChange={(e) =>
                  handleExpenseChange(index, "description", e.target.value)
                }
              />
            </div>
          ))}
          <button onClick={handleAddExpense}>+ Add Expense</button>
        </div>
        <div>
          <label>
            Special Work:
            <input
              type="number"
              value={specialWork}
              onChange={(e) => setSpecialWork(parseFloat(e.target.value) || 0)}
              min="0"
            />
          </label>
        </div>
        <div>
          <h2>Total: ${calculateTotalAmount() + specialWork}</h2>
          <h2>Per Day: ${calculatePerDayCost().toFixed(2)}</h2>
        </div>
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
                remarks[index] === ""
                  ? daysInMonth
                  : parseInt(remarks[index]) || 0;
              const expenditure = perDayCost * daysStayed;
              return (
                <tr key={index}>
                  <td>{person.flatNumber}</td>
                  <td>{person.name}</td>
                  <td>Rs. {2000}</td>
                  <td>Rs. {expenditure.toFixed(2)}</td>
                  <td>Rs. {specialWorkPerPerson.toFixed(2)}</td>
                  <td>Rs. {(expenditure + specialWorkPerPerson).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={remarks[index]}
                      onChange={(e) =>
                        handleRemarkChange(index, e.target.value)
                      }
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
        <button onClick={generatePDF} style={{ marginTop: "20px" }}>
          Print PDF
        </button>
      </header>
    </div>
  );
}

export default App;
