// import '/node_modules/leaflet/dist/leaflet.css'
// import '/node_modules/leaflet/dist/leaflet.js'
// import L from 'leaflet'

var map = L.map('map').setView([43.65, -79.39], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


const mapbox_accessToken = 'pk.eyJ1IjoiYXNhZHMyMyIsImEiOiJjbG1ud29wbDQwdmR5MnRsMTlxNHV3eGQyIn0.LR7dYh818Ya5Ls9iTmCJ_Q'

// var marker = L.circle([51.508, -0.11], {
//   color: 'red',
//   fillColor: '#f03',
//   fillOpacity: 0.5,
//   radius: 500
// }).addTo(map);