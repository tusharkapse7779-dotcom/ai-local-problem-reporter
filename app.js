let reports = [];
let map, heatLayer, markers = [];

window.onload = () => {
  map = L.map('map').setView([19.07,72.87],5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

  // image preview
  image.onchange = e => {
    const file = e.target.files[0];
    if(file){
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }
  };
};

// DISTANCE
function dist(a,b,c,d){
  const R=6371;
  const dLat=(c-a)*Math.PI/180;
  const dLon=(d-b)*Math.PI/180;

  const x = Math.sin(dLat/2)**2 +
    Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180) *
    Math.sin(dLon/2)**2;

  return R * 2 * Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

// GENERATE
function generate(){

  const cat = category.value;
  const dis = district.value;
  const prob = problem.value;

  if(!cat||!dis||!prob){
    output.innerText="⚠️ Fill all fields";
    return;
  }

  const lat = 19 + Math.random();
  const lng = 72 + Math.random();

  // duplicate
  for(let r of reports){
    if(dist(lat,lng,r.lat,r.lng)<0.3 && r.cat===cat){
      output.innerText="⚠️ Duplicate!\nToken:"+r.id;
      return;
    }
  }

  const token="TOK"+Math.floor(Math.random()*100000);

  const report={
    id:token,
    cat,
    dis,
    prob,
    lat,
    lng,
    status:"Pending"
  };

  reports.push(report);

  output.innerText="✅ Token: "+token;

  render();
  updateMap();
}

// RENDER
function render(){
  list.innerHTML="";

  reports.forEach(r=>{
    list.innerHTML+=`
      <div class="report">
        ${r.cat} (${r.dis})<br>
        Token: ${r.id}<br>
        Status: ${r.status}
      </div>
    `;
  });

  analyticsUI();
}

// ANALYTICS
function analyticsUI(){
  let g=0,w=0,rd=0;

  reports.forEach(r=>{
    if(r.cat==="Garbage") g++;
    if(r.cat==="Water Leakage") w++;
    if(r.cat==="Road Damage") rd++;
  });

  analytics.innerHTML=`
    <div class="analytics-box red">Garbage: ${g}</div>
    <div class="analytics-box blue">Water: ${w}</div>
    <div class="analytics-box green">Road: ${rd}</div>
    <p>🔥 Most: ${g>=w&&g>=rd?"Garbage":w>=rd?"Water":"Road"}</p>
  `;
}

// MAP
function updateMap(){

  if(heatLayer) map.removeLayer(heatLayer);
  markers.forEach(m=>map.removeLayer(m));
  markers=[];

  let pts=[];

  reports.forEach(r=>{
    pts.push([r.lat,r.lng,0.5]);

    const m=L.marker([r.lat,r.lng])
      .addTo(map)
      .bindPopup(`${r.cat}<br>${r.id}`);

    markers.push(m);
  });

  heatLayer=L.heatLayer(pts).addTo(map);
}
