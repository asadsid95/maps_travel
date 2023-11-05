// import "./node_modules/leaflet/dist/leaflet.css"; // Import Leaflet's CSS
import "./node_modules/leaflet/dist/leaflet.js"; // Import Leaflet

// let dotenv = require("dotenv").config();
// let ACCESS_TOKEN = process.env.ACCESS_TOKEN;

let COORDINATES_TORONTO = [43.65, -79.39];
let ACCESS_TOKEN =
  "pk.eyJ1IjoiYXNhZHMyMyIsImEiOiJjbG1ud2pyZzkwem95MmpuNXdxNW1wczE1In0.rVhuUWrEFEMpYFyaaVmt4Q";

let map = L.map("map").setView(COORDINATES_TORONTO, 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let formElement = document.getElementById("locationInput");
formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const refinedData = Object.fromEntries(formData.entries());

  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${refinedData.country}.json?access_token=${ACCESS_TOKEN}`
  )
    .then((res) => res.json())
    .then((res) => {
      const coordinates = res.features[0].geometry.coordinates;

      L.marker([coordinates[1], coordinates[0]]).addTo(map);

      map.setView([coordinates[1], coordinates[0]], 1);
    })
    .catch((err) => console.log(err));
});

let marker = L.circle([43.65, -79.39], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(map);

// -----------------------

// function initializeMap() {
//   const map = L.map("map").setView(COORDINATES_TORONTO, 2);
//   L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//     attribution:
//       '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   }).addTo(map);
//   return map;
// }

// function addMarkerAndZoom(map, coordinates) {
//   L.marker(coordinates).addTo(map);
//   map.setView(coordinates, 1);
// }

// function fetchAndAddMarker(map) {
//   const formElement = document.getElementById("locationInput");
//   formElement.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const refinedData = Object.fromEntries(formData.entries());
//     fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${refinedData.country}.json?access_token=${ACCESS_TOKEN}`
//     )
//       .then((res) => res.json())
//       .then((res) => {
//         const coordinates = res.features[0].geometry.coordinates;
//         addMarkerAndZoom(map, [coordinates[1], coordinates[0]]);
//       })
//       .catch((err) => console.log(err));
//   });
// }

// function createMarkerCircle(map, coordinates) {
//   L.circle(coordinates, {
//     color: "red",
//     fillColor: "#f03",
//     fillOpacity: 0.5,
//     radius: 500,
//   }).addTo(map);
// }

// const map = initializeMap();
// fetchAndAddMarker(map);
// createMarkerCircle(map);
