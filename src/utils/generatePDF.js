// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const generatePDF = (
//   data,
//   specialWorkPerPerson,
//   remarks,
//   daysInMonth,
//   perDayCost,
//   people
// ) => {
//   const doc = new jsPDF();
//   const heading = `Pratibha Complex Maintenance ${data.selectedDate.toLocaleString(
//     "default",
//     { month: "long" }
//   )} ${data.selectedDate.getFullYear()}`;

//   doc.setFontSize(16);
//   doc.text(heading, doc.internal.pageSize.getWidth() / 2, 10, "center");

//   doc.setFontSize(12);
//   doc.autoTable({
//     head: [["Expenditure", "Special Work", "Total"]],
//     body: [
//       [
//         `$${data.calculateTotalAmount()}`,
//         `$${data.calculateSpecialWorkTotal()}`,
//         `$${data.calculateTotalAmount() + data.calculateSpecialWorkTotal()}`,
//       ],
//     ],
//     startY: 15,
//     margin: { top: 10 },
//   });
//   let y = doc.autoTable.previous.finalY + 10;
//   doc.text("Expenses List:", 10, y);
//   y += 5;
//   doc.autoTable({
//     head: [["Task Name", "Amount", "Description"]],
//     body: data.expenses.map((expense) => [
//       expense.taskName,
//       `$${expense.amount.toFixed(2)}`,
//       expense.description,
//     ]),
//     startY: y,
//     margin: { top: 10 },
//   });
//   y = doc.autoTable.previous.finalY + 10;
//   // y+=10
//   doc.text("Special Work List:", 10, y);
//   y += 5;
//   doc.autoTable({
//     head: [["Task Name", "Amount", "Description"]],
//     body: data.specialWork.map((expense) => [
//       expense.taskName,
//       `$${expense.amount.toFixed(2)}`,
//       expense.description,
//     ]),
//     startY: y,
//     margin: { top: 10 },
//   });
//   doc.addPage();
//   y = 10;
//   doc.setFontSize(14);
//   doc.text(
//     `Maintenance`,
//     doc.internal.pageSize.getWidth() / 2,
//     y + 10,
//     "center"
//   );

//   y += 20;

//   doc.autoTable({
//     head: [
//       [
//         "Flat Number",
//         "Name",
//         "Paid Balance",
//         "Expenditure",
//         "Special Work Per Person",
//         "Total Payable Amount",
//         "Remarks",
//       ],
//     ],
//     body: people.map((person, index) => {
//       const daysStayed =
//         remarks[index] === "" ? daysInMonth : parseInt(remarks[index]) || 0;
//       const expenditure = perDayCost * daysStayed;
//       return [
//         person.flatNumber,
//         person.name,
//         "Rs. 2000",
//         `Rs. ${expenditure.toFixed(2)}`,
//         `Rs. ${specialWorkPerPerson.toFixed(2)}`,
//         `Rs. ${(expenditure + specialWorkPerPerson).toFixed(2)}`,
//         remarks[index] || "",
//       ];
//     }),
//     startY: y,
//     margin: { top: 10 },
//   });

//   doc.save("maintenance-calculation.pdf");
// };

// export default generatePDF;

// <---------------->new theme <-------------------------->

import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = (
  data,
  specialWorkPerPerson,
  remarks,
  daysInMonth,
  perDayCost,
  people,
  buildingName,
  paidBalance
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Define custom theme styles
  const theme = {
    primaryColor: "#333333", // Charcoal
    secondaryColor: "#E1E1E1", // Light Gray
    fontFamily: "Times New Roman, serif",
  };

  // const theme = {
  //   primaryColor: "#4A90E2",
  //   secondaryColor: "#50E3C2",
  //   fontFamily: "helvetica",
  // };

  const heading = `${buildingName} Maintenance ${data.selectedDate.toLocaleString(
    "default",
    { month: "long" }
  )} ${data.selectedDate.getFullYear()}`;

  doc.setFontSize(16);
  doc.setFont(theme.fontFamily);
  doc.setTextColor(theme.primaryColor);
  doc.text(heading, pageWidth / 2, 10, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor("#000000");
  doc.autoTable({
    head: [["Expenditure", "Special Work", "Total"]],
    body: [
      [
        `Rs. ${data.calculateTotalAmount()}`,
        `Rs. ${data.calculateSpecialWorkTotal()}`,
        `Rs. ${data.calculateTotalAmount() + data.calculateSpecialWorkTotal()}`,
      ],
    ],
    startY: 15,
    margin: { top: 10 },
    headStyles: {
      fillColor: theme.primaryColor,
      textColor: "#FFFFFF",
    },
    bodyStyles: {
      fillColor: theme.secondaryColor,
      textColor: "#000000",
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2,
  });

  let y = doc.autoTable.previous.finalY + 10;
  doc.setTextColor(theme.primaryColor);
  doc.text("Expenses List:", 10, y);
  y += 5;
  doc.setTextColor("#000000");
  doc.autoTable({
    head: [["Task Name", "Amount", "Description"]],
    body: data.expenses.map((expense) => [
      expense.taskName,
      `Rs. ${expense.amount.toFixed(2)}`,
      expense.description === "" ? "--" : expense.description,
    ]),
    startY: y,
    margin: { top: 10 },
    headStyles: {
      fillColor: theme.primaryColor,
      textColor: "#FFFFFF",
    },
    bodyStyles: {
      fillColor: theme.secondaryColor,
      textColor: "#000000",
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2,
  });

  y = doc.autoTable.previous.finalY + 10;
  doc.setTextColor(theme.primaryColor);
  doc.text("Special Work List:", 10, y);
  y += 5;
  doc.setTextColor("#000000");
  doc.autoTable({
    head: [["Task Name", "Amount", "Description"]],
    body: data.specialWork.map((expense) => [
      expense.taskName,
      `Rs. ${expense.amount.toFixed(2)}`,
      expense.description === "" ? "--" : expense.description,
    ]),
    startY: y,
    margin: { top: 10 },
    headStyles: {
      fillColor: theme.primaryColor,
      textColor: "#FFFFFF",
    },
    bodyStyles: {
      fillColor: theme.secondaryColor,
      textColor: "#000000",
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2,
  });
  y = doc.autoTable.previous.finalY + 10;

  doc.addPage();
  y = 10;
  doc.setFontSize(14);
  doc.setTextColor(theme.primaryColor);
  doc.text("Maintenance", pageWidth / 2, y + 10, { align: "center" });

  y += 20;
  doc.setTextColor("#000000");
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
        `Rs. ${paidBalance[index]}`,
        `Rs. ${expenditure.toFixed(1)}`,
        `Rs. ${specialWorkPerPerson.toFixed(1)}`,
        // `Rs. ${(expenditure + specialWorkPerPerson).toFixed(2)}`,
        `Rs. ${Math.round(expenditure + specialWorkPerPerson + 0.2)}`,
        remarks[index] || "--",
      ];
    }),
    startY: y,
    margin: { top: 10 },
    headStyles: {
      fillColor: theme.primaryColor,
      textColor: "#FFFFFF",
    },
    bodyStyles: {
      fillColor: theme.secondaryColor,
      textColor: "#000000",
    },
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.2,
  });
  const monthShort = data.selectedDate.toLocaleString("default", {
    month: "short",
  });
  const year = data.selectedDate.getFullYear();
  const fileName = `${monthShort}-${year} Maintenance.pdf`;
  doc.save(fileName);
};

export default generatePDF;
