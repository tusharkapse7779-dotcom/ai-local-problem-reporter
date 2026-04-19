let reports = [];
let map, marker, heatLayer;
let userLocation = { lat: 19.07, lng: 72.87 };
let lastReport = null;

window.onload = () => {
  document.getElementById("btn").addEventListener("click", generate);

  document.getElementById("imageInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const preview = document.getElementById("preview");
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  });

  initMap();
  loadDemo();
  renderReports();
};

// MAP
function initMap() {
  map = L.map('map').setView([19.07,72.87], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

// LOCATION
function getLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    userLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };

    map.setView([userLocation.lat,userLocation.lng],13);
    if(marker) map.removeLayer(marker);

    marker = L.marker([userLocation.lat,userLocation.lng]).addTo(map);
  });
}

// GENERATE
function generate() {
  const cat = category.value;
  const state = document.getElementById("state").value;
  const dist = district.value;
  const problem = document.getElementById("problem").value;

  if (!cat || !state || !dist || !problem) {
    output.innerText = "Fill all fields";
    return;
  }

  const token = "TOK" + Math.floor(Math.random()*100000);

  const report = {
    id: token,
    cat, state, dist,
    desc: problem,
    lat: userLocation.lat,
    lng: userLocation.lng,
    status: "Pending"
  };

  reports.push(report);
  lastReport = report;

  output.innerText = "Token: " + token;

  renderReports();
  updateHeatmap();
}

// RENDER
function renderReports() {
  reportList.innerHTML = "";

  reports.forEach(r => {
    reportList.innerHTML += `
      <div class="report-card" onclick="show('${r.id}')">
        ${r.cat} (${r.state})<br>
        Token: ${r.id}<br>
        Status: ${r.status}
      </div>
    `;
  });
}

// SHOW
function show(id) {
  const r = reports.find(x => x.id == id);

  map.setView([r.lat,r.lng],13);
  if(marker) map.removeLayer(marker);
  marker = L.marker([r.lat,r.lng]).addTo(map);

  output.innerText =
    "Token: " + r.id +
    "\nIssue: " + r.cat +
    "\nStatus: " + r.status;
}

// HEATMAP
function updateHeatmap() {
  if(heatLayer) map.removeLayer(heatLayer);

  const points = reports.map(r => [r.lat,r.lng,Math.random()]);

  heatLayer = L.heatLayer(points).addTo(map);
}

// ADMIN
function updateStatus() {
  const t = searchToken.value;
  const s = statusUpdate.value;

  const r = reports.find(x => x.id == t);
  if (!r) return alert("Not found");

  r.status = s;
  renderReports();
}

// PDF EXPORT
function downloadPDF() {
  if (!lastReport) return alert("Generate report first");

  const doc = new jspdf.jsPDF();

  doc.text("CivicSense AI Report", 10, 10);
  doc.text("Token: " + lastReport.id, 10, 20);
  doc.text("Issue: " + lastReport.cat, 10, 30);
  doc.text("Location: " + lastReport.state + ", " + lastReport.dist, 10, 40);
  doc.text("Status: " + lastReport.status, 10, 50);
  doc.text("Description: " + lastReport.desc, 10, 60);

  doc.save("report.pdf");
}

// DEMO
function loadDemo() {
  for(let i=1;i<=5;i++){
    reports.push({
      id:"TOK"+i,
      cat:"Garbage",
      state:"Maharashtra",
      dist:"District "+i,
      desc:"Demo issue",
      lat:19+Math.random(),
      lng:72+Math.random(),
      status:"Pending"
    });
  }
}
