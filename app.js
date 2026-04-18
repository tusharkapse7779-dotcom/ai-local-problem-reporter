let reports = JSON.parse(localStorage.getItem("reports")) || [];

// 10 DEMO REPORTS
if (reports.length === 0) {
  for (let i = 1; i <= 10; i++) {
    reports.push({
      id: "TOK" + i,
      cat: ["Garbage","Pothole","Water Leakage","Street Light"][i%4],
      state: ["Maharashtra","Delhi","Karnataka","Telangana"][i%4],
      dist: "District " + i,
      desc: "Sample issue " + i,
      img: "https://picsum.photos/200?random=" + i
    });
  }
  localStorage.setItem("reports", JSON.stringify(reports));
}

window.onload = () => {
  document.getElementById("btn").addEventListener("click", generate);
  renderReports();
  renderChart();
};

// GENERATE REPORT (FIXED)
function generate() {
  const cat = document.getElementById("category").value;
  const state = document.getElementById("state").value;
  const dist = document.getElementById("district").value;
  const problem = document.getElementById("problem").value;
  const file = document.getElementById("imageInput").files[0];
  const output = document.getElementById("output");

  if (!cat || !state || !dist || !problem) {
    output.innerText = "⚠️ Fill all fields";
    return;
  }

  const token = "TOK" + Math.floor(Math.random() * 1000000);
  const img = file ? URL.createObjectURL(file) : "https://picsum.photos/200";

  reports.push({ id: token, cat, state, dist, desc: problem, img });

  localStorage.setItem("reports", JSON.stringify(reports));

  output.innerText = "✅ Report Generated\nToken: " + token;

  renderReports();
  renderChart();
}

// SHOW REPORTS
function renderReports() {
  const list = document.getElementById("reportList");
  list.innerHTML = "";

  reports.forEach(r => {
    list.innerHTML += `
      <div class="report-card" onclick="showDetails('${r.id}')">
        <b>${r.cat}</b> (${r.state})<br>
        Token: ${r.id}
        <img src="${r.img}">
      </div>
    `;
  });
}

// CLICK → SHOW FULL DETAILS
function showDetails(id) {
  const r = reports.find(x => x.id == id);
  document.getElementById("output").innerText =
    "📄 FULL REPORT\n\n" +
    "Token: " + r.id + "\n" +
    "Issue: " + r.cat + "\n" +
    "Location: " + r.state + ", " + r.dist + "\n" +
    "Description: " + r.desc;
}

// CHART
function renderChart() {
  const counts = {Garbage:0,Pothole:0,"Water Leakage":0,"Street Light":0};

  reports.forEach(r => counts[r.cat]++);

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Issues Count",
        data: Object.values(counts)
      }]
    }
  });
}
