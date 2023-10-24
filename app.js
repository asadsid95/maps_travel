require('dotenv').config()

const apiKey=process.env.PUBLIC


var map = L.map('map').setView([43.65, -79.39], 1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var formElement = document.getElementById('locationInput')
formElement.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const refinedData= Object.fromEntries(formData.entries())

    // console.log(mapbox_accessToken)
    
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${refinedData.country}.json?access_token=${apiKey}`)
    .then(res => res.json())
    .then(res => {

        console.log(res)
        const coordinates = res.features[0].geometry.coordinates
        console.log(coordinates)

        L.marker([coordinates[1], coordinates[0]]).addTo(map)

        map.setView([coordinates[1], coordinates[0]], 1)

    })
    .catch(err => console.log(err))


})




var marker = L.circle([43.65, -79.39], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500
}).addTo(map);