let reports = [];
let map, heatLayer, markers = [];

let userLocation = {
  lat: 19.07,
  lng: 72.87
};

// MAP INIT
window.onload = () => {
  map = L.map('map').setView([19.07,72.87],5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);
};

// DISTANCE (duplicate check)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;

  const a =
    Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)*Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// GENERATE REPORT
function generate() {
  const cat = category.value;
  const dist = district.value;
  const prob = problem.value;

  if(!cat || !dist || !prob){
    output.innerText = "⚠️ Fill all fields";
    return;
  }

  // fake location (safe demo)
  const lat = 19 + Math.random();
  const lng = 72 + Math.random();

  // duplicate check
  for(let r of reports){
    if(getDistance(lat,lng,r.lat,r.lng) < 0.3 && r.cat === cat){
      output.innerText = "⚠️ Duplicate detected!\nToken: "+r.id;
      return;
    }
  }

  const token = "TOK" + Math.floor(Math.random()*100000);

  const report = {
    id: token,
    cat,
    dist,
    prob,
    lat,
    lng,
    status: "Pending"
  };

  reports.push(report);

  output.innerText = "✅ Report Generated\nToken: "+token;

  render();
  updateMap();
}

// RENDER
function render() {
  list.innerHTML = "";

  reports.forEach(r => {
    list.innerHTML += `
      <div class="report" onclick="toggle('${r.id}')">
        <b>${r.cat}</b> (${r.dist})<br>
        Token: ${r.id}<br>
        Status: ${r.status}
      </div>
    `;
  });

  updateAnalytics();
}

// TOGGLE STATUS
function toggle(id){
  const r = reports.find(x=>x.id===id);
  r.status = r.status === "Pending" ? "Done" : "Pending";
  render();
}

// ANALYTICS
function updateAnalytics(){
  let g=0,w=0,r=0;

  reports.forEach(x=>{
    if(x.cat==="Garbage") g++;
    if(x.cat==="Water Leakage") w++;
    if(x.cat==="Road Damage") r++;
  });

  analytics.innerHTML = `
    <div class="analytics-box red">Garbage: ${g}</div>
    <div class="analytics-box blue">Water: ${w}</div>
    <div class="analytics-box green">Road: ${r}</div>
  `;
}

// MAP + HEAT + PINS
function updateMap(){
  if(heatLayer) map.removeLayer(heatLayer);
  markers.forEach(m=>map.removeLayer(m));
  markers=[];

  const pts=[];

  reports.forEach(r=>{
    pts.push([r.lat,r.lng,0.5]);

    const m = L.marker([r.lat,r.lng])
      .addTo(map)
      .bindPopup(`${r.cat}<br>${r.id}`);

    markers.push(m);
  });

  heatLayer = L.heatLayer(pts).addTo(map);
}
