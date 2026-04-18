let reports = [];
let map, marker, heatLayer;
let userLocation = { lat: 19.07, lng: 72.87 };
let lastReport = null;

window.onload = () => {
  document.getElementById("btn").addEventListener("click", generate);

  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
  };

  document.getElementById("imageInput").onchange = e => {
    const file = e.target.files[0];
    if(file){
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  };

  initMap();
};

// MAP
function initMap(){
  map = L.map('map').setView([19.07,72.87],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

// LOCATION
function getLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    userLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };
    map.setView([userLocation.lat,userLocation.lng],13);
  });
}

// GENERATE
function generate(){
  const cat = category.value;
  const state = stateSelect.value;
  const dist = district.value;
  const problem = problemInput.value;

  if(!cat || !state || !dist || !problem){
    output.innerText = "Fill all fields";
    return;
  }

  const token = "TOK"+Math.floor(Math.random()*100000);

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

  output.innerText = "Token: "+token;

  renderReports();
  updateHeatmap();
}

// RENDER
function renderReports(){
  reportList.innerHTML = "";

  reports.forEach(r=>{
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
function show(id){
  const r = reports.find(x=>x.id==id);

  map.setView([r.lat,r.lng],13);
  marker && map.removeLayer(marker);
  marker = L.marker([r.lat,r.lng]).addTo(map);

  output.innerText =
    "Token: "+r.id+
    "\nIssue: "+r.cat+
    "\nStatus: "+r.status;
}

// HEATMAP
function updateHeatmap(){
  if(heatLayer) map.removeLayer(heatLayer);

  const pts = reports.map(r=>[r.lat,r.lng,Math.random()]);
  heatLayer = L.heatLayer(pts).addTo(map);
}

// ADMIN
function updateStatus(){
  const t = searchToken.value;
  const s = statusUpdate.value;

  const r = reports.find(x=>x.id==t);
  if(!r) return alert("Not found");

  r.status = s;
  renderReports();
}

// PDF
function downloadPDF(){
  if(!lastReport) return alert("Generate report first");

  const doc = new jspdf.jsPDF();

  doc.text("UrbanPulse AI Report",10,10);
  doc.text("Token: "+lastReport.id,10,20);
  doc.text("Issue: "+lastReport.cat,10,30);
  doc.text("Status: "+lastReport.status,10,40);

  doc.save("report.pdf");
}
