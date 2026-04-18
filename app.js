let reports = JSON.parse(localStorage.getItem("reports")) || [
  {
    id: 101,
    category: "Garbage",
    location: "Mumbai",
    status: "Pending",
    desc: "Garbage overflow near road",
    image: ""
  },
  {
    id: 102,
    category: "Pothole",
    location: "Delhi",
    status: "In Progress",
    desc: "Large pothole causing accidents",
    image: ""
  },
  {
    id: 103,
    category: "Water Leakage",
    location: "Aurangabad",
    status: "Completed",
    desc: "Water pipe leaking continuously",
    image: ""
  },
  {
    id: 104,
    category: "Street Light",
    location: "Pune",
    status: "Pending",
    desc: "Street light not working",
    image: ""
  },
  {
    id: 105,
    category: "Garbage",
    location: "Hyderabad",
    status: "In Progress",
    desc: "Garbage pile not cleared",
    image: ""
  }
];

function saveReports() {
  localStorage.setItem("reports", JSON.stringify(reports));
}

function generate() {
  const category = document.getElementById("category").value;
  const problem = document.getElementById("problem").value;
  const location = document.getElementById("location").value;
  const imageInput = document.getElementById("imageInput");
  const output = document.getElementById("output");

  if (!category || !problem || !location) {
    alert("Fill all fields");
    return;
  }

  const id = Date.now();

  const newReport = {
    id,
    category,
    location,
    status: "Pending",
    desc: problem,
    image: imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : ""
  };

  reports.push(newReport);
  saveReports();
  renderReports();

  output.innerText = `✅ Report Generated
Token No: ${id}
Status: Pending`;
}

// Auto status update (smart feature)
setInterval(() => {
  reports.forEach(r => {
    if (r.status === "Pending") r.status = "In Progress";
    else if (r.status === "In Progress") r.status = "Completed";
  });
  saveReports();
  renderReports();
}, 8000);

function renderReports() {
  const container = document.getElementById("reportList");
  container.innerHTML = "";

  reports.forEach(r => {
    container.innerHTML += `
      <div class="report-card">
        <h4>${r.category} - ${r.location}</h4>
        <p>${r.desc}</p>
        <p><b>Token:</b> ${r.id}</p>
        <p>Status: <span class="${r.status}">${r.status}</span></p>
        ${r.image ? `<img src="${r.image}" />` : ""}
      </div>
    `;
  });
}

renderReports();
