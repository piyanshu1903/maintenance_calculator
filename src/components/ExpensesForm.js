import React from "react";

function ExpensesForm({
  expenses,
  specialWork,
  onExpenseChange,
  onAddExpense,
  handleRemoveExpense,
  onSpecialWorkChange,
}) {
  return (
    <div>
      <h2>Expenses</h2>
      {expenses.map((expense, index) => (
        <div key={index} className="expense-entry">
          <input
            type="text"
            placeholder="Task Name"
            value={expense.taskName}
            onChange={(e) => onExpenseChange(index, "taskName", e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => onExpenseChange(index, "amount", e.target.value)}
            min="0"
          />
          <input
            type="text"
            placeholder="Short Description"
            value={expense.description}
            onChange={(e) =>
              onExpenseChange(index, "description", e.target.value)
            }
          />
          <button onClick={() => handleRemoveExpense(index)}>Remove</button>
        </div>
      ))}
      <button
        onClick={() =>
          onAddExpense({ taskName: "", amount: 0, description: "" })
        }
      >
        + Add Expense
      </button>
    </div>
  );
}

export default ExpensesForm;
