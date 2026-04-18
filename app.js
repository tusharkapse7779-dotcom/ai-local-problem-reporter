let reports = JSON.parse(localStorage.getItem("reports")) || [];

// DEMO REPORTS (REALISTIC)
if (reports.length === 0) {
  const issues = ["Garbage","Water Leakage","Road Damage","Dog Bite","Street Light"];
  const states = ["Maharashtra","Delhi","Karnataka","Telangana"];

  for (let i = 1; i <= 10; i++) {
    reports.push({
      id: "TOK" + i,
      cat: issues[i % issues.length],
      state: states[i % states.length],
      dist: "District " + i,
      desc: issues[i % issues.length] + " issue reported",
      img: "https://picsum.photos/200?random=" + i
    });
  }
  localStorage.setItem("reports", JSON.stringify(reports));
}

window.onload = () => {
  document.getElementById("btn").addEventListener("click", generate);
  document.getElementById("voiceBtn").addEventListener("click", startVoice);
  renderReports();
  renderCharts();
};

// GENERATE REPORT
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
  renderCharts();
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

// DETAILS
function showDetails(id) {
  const r = reports.find(x => x.id == id);
  document.getElementById("output").innerText =
    "📄 FULL REPORT\n\n" +
    "Token: " + r.id + "\n" +
    "Issue: " + r.cat + "\n" +
    "Location: " + r.state + ", " + r.dist + "\n" +
    "Description: " + r.desc;
}

// VOICE INPUT
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = function(event) {
    document.getElementById("problem").value = event.results[0][0].transcript;
  };
}

// CHARTS
function renderCharts() {
  const issueCount = {};
  const stateCount = {};

  reports.forEach(r => {
    issueCount[r.cat] = (issueCount[r.cat] || 0) + 1;
    stateCount[r.state] = (stateCount[r.state] || 0) + 1;
  });

  new Chart(document.getElementById("issueChart"), {
    type: "pie",
    data: {
      labels: Object.keys(issueCount),
      datasets: [{
        data: Object.values(issueCount),
        backgroundColor: ["red","blue","orange","green","purple"]
      }]
    }
  });

  new Chart(document.getElementById("stateChart"), {
    type: "bar",
    data: {
      labels: Object.keys(stateCount),
      datasets: [{
        label: "Reports by State",
        data: Object.values(stateCount),
        backgroundColor: ["#ff6384","#36a2eb","#ffce56","#4bc0c0"]
      }]
    }
  });
}
