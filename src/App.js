import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExpensesForm from "./components/ExpensesForm";
import SpecialWork from "./components/specialwork";
import MaintenanceTable from "./components/MaintenanceTable";
import generatePDF from "./utils/generatePDF";
import "./App.css";

const people = [
  { name: "Mr Tejeet", flatNumber: "001" },
  { name: "Mr Praveen", flatNumber: "101" },
  { name: "Mrs Sushila Devi", flatNumber: "103" },
  { name: "Mr Nilesh Chabuskar", flatNumber: "104" },
  { name: "Mr Sabu TN", flatNumber: "201" },
  { name: "Mr RP Pallai", flatNumber: "203" },
  { name: "Mr Sailesh Deshmukh", flatNumber: "204" },
  { name: "Mr Ashok Palakhe", flatNumber: "301" },
  { name: "Mr Kishore Adapa", flatNumber: "302" },
  { name: "Mrs Vani Adapa", flatNumber: "303" },
  { name: "Mrs Nitatai D Mohite", flatNumber: "304" },
  { name: "Mr Sunil Kumar", flatNumber: "401" },
  { name: "Smt Anita D Dhiwar", flatNumber: "403" },
  { name: "Mr Samadhan Gaikwad", flatNumber: "404" },
  { name: "Mr Yashraj Gaikwad", flatNumber: "501" },
];

function App() {
  const [message, setMessage] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const handleBuildingNameChange = (event) => {
    setBuildingName(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const [expenses, setExpenses] = useState([
    { taskName: "", amount: 0, description: "" },
  ]);

  const [specialWork, setSpecialWork] = useState([
    { taskName: "", amount: 0, description: "" },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [remarks, setRemarks] = useState(Array(people.length).fill(""));
  const [paidBalance, setPaidBalance] = useState(
    Array(people.length).fill("2000")
  );

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(selectedDate);

  const handleAddExpense = (expense) => setExpenses([...expenses, expense]);
  const handleAddSpecialWork = () =>
    setSpecialWork([
      ...specialWork,
      { taskName: "", amount: 0, description: "" },
    ]);
  const handleSpecialWorkChange = (index, field, value) => {
    const newSpecialWork = [...specialWork];
    newSpecialWork[index][field] =
      field === "amount" ? parseFloat(value) || 0 : value;
    setSpecialWork(newSpecialWork);
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
  const handlePaidBalanceChange = (index, value) => {
    const validValue =
      value === "" ||
      (/^[0-9\b]+$/.test(value) &&
        parseInt(value) >= 0 &&
        parseInt(value) <= 5000)
        ? value
        : paidBalance[index];
    const newBalance = [...paidBalance];
    newBalance[index] = validValue;
    setPaidBalance(newBalance);
  };
  const handleRemoveExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };
  const handleRemoveSpecialWork = (index) =>
    setSpecialWork(specialWork.filter((_, i) => i !== index));

  const calculateTotalAmount = () =>
    expenses.reduce((total, expense) => total + expense.amount, 0);

  const calculateSpecialWorkTotal = () =>
    specialWork.reduce((total, work) => total + work.amount, 0);

  const calculatePerDayCost = () => {
    const total = calculateTotalAmount();
    const peopleWithNoRemarks = remarks.filter(
      (remark) => remark === ""
    ).length;
    const totalDaysStayed = remarks.reduce(
      (total, remark) => total + (remark !== "" ? parseInt(remark) : 0),
      0
    );
    const totalDays = totalDaysStayed + peopleWithNoRemarks * daysInMonth;
    return totalDays > 0 ? total / totalDays : 0;
  };

  const perDayCost = calculatePerDayCost();
  const specialWorkPerPerson = calculateSpecialWorkTotal() / people.length;

  const handleGeneratePDF = () => {
    generatePDF(
      {
        expenses,
        specialWork,
        selectedDate,
        calculateTotalAmount,
        calculateSpecialWorkTotal,
      },
      specialWorkPerPerson,
      remarks,
      daysInMonth,
      perDayCost,
      people,
      message,
      buildingName,
      paidBalance
    );
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
          <label>Enter the Building/Complex name:</label>
          <input
            type="text"
            value={buildingName}
            onChange={handleBuildingNameChange}
            placeholder="Enter Building Name"
          />
        </div>
        {/* <div>
          <label>Enter the message:</label>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter the message"
          />
        </div> */}
        <ExpensesForm
          expenses={expenses}
          onExpenseChange={handleExpenseChange}
          onAddExpense={handleAddExpense}
          handleRemoveExpense={handleRemoveExpense}
        />
        <SpecialWork
          specialWork={specialWork}
          handleSpecialWorkChange={handleSpecialWorkChange}
          handleAddSpecialWork={handleAddSpecialWork}
          handleRemoveSpecialWork={handleRemoveSpecialWork}
        />
        <div style={{ textAlign: "left" }}>
          <h4>
            Expenditure: Rs. {calculateTotalAmount()} *Based on days stayed
          </h4>
          <h4>
            Special Work: Rs. {calculateSpecialWorkTotal()} *Equally shared
          </h4>
        </div>
        <div>
          <h2>
            Total: Rs. {calculateTotalAmount() + calculateSpecialWorkTotal()}
          </h2>
          <h2>Per Day: Rs. {perDayCost.toFixed(2)}</h2>
        </div>
        <MaintenanceTable
          people={people}
          remarks={remarks}
          onRemarkChange={handleRemarkChange}
          perDayCost={perDayCost}
          specialWorkPerPerson={specialWorkPerPerson}
          daysInMonth={daysInMonth}
          paidBalance={paidBalance}
          onPaidBalanceChange={handlePaidBalanceChange}
        />
        <button onClick={handleGeneratePDF} style={{ marginTop: "20px" }}>
          Print PDF
        </button>
      </header>
    </div>
  );
}

export default App;
