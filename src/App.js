import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ExpensesForm from "./components/ExpensesForm";
import SpecialWork from "./components/specialwork";
import MaintenanceTable from "./components/MaintenanceTable";
import generatePDF from "./utils/generatePDF";
import "./App.css";

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
      buildingName
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
        <div>
          <label>Enter the message:</label>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter the message"
          />
        </div>
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
          <h4>Expenditure: ${calculateTotalAmount()} *Based on days stayed</h4>
          <h4>Special Work: ${calculateSpecialWorkTotal()} *Equally shared</h4>
        </div>
        <div>
          <h2>
            Total: ${calculateTotalAmount() + calculateSpecialWorkTotal()}
          </h2>
          <h2>Per Day: ${perDayCost.toFixed(2)}</h2>
        </div>
        <MaintenanceTable
          people={people}
          remarks={remarks}
          onRemarkChange={handleRemarkChange}
          perDayCost={perDayCost}
          specialWorkPerPerson={specialWorkPerPerson}
          daysInMonth={daysInMonth}
        />
        <button onClick={handleGeneratePDF} style={{ marginTop: "20px" }}>
          Print PDF
        </button>
      </header>
    </div>
  );
}

export default App;
