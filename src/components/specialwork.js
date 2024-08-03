import React from "react";

const SpecialWork = ({
  specialWork,
  handleSpecialWorkChange,
  handleAddSpecialWork,
  handleRemoveSpecialWork,
}) => {
  return (
    <div>
      <h2>Special Work</h2>
      {specialWork.map((work, index) => (
        <div key={index} className="expense-entry">
          <input
            type="text"
            placeholder="Task Name"
            value={work.taskName}
            onChange={(e) =>
              handleSpecialWorkChange(index, "taskName", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={work.amount}
            onChange={(e) =>
              handleSpecialWorkChange(index, "amount", e.target.value)
            }
            min="0"
          />
          <input
            type="text"
            placeholder="Short Description"
            value={work.description}
            onChange={(e) =>
              handleSpecialWorkChange(index, "description", e.target.value)
            }
          />
          <button onClick={() => handleRemoveSpecialWork(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddSpecialWork}>+ Add Special Work</button>
    </div>
  );
};

export default SpecialWork;
