import mapboxgl from './node_modules/mapbox-gl';

mapboxgl.accessToken = 'CHECK ENV';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/examples/clg45vm7400c501pfubolb0xz',
  center: [-87.661557, 41.893748],
  zoom: 10.7
});

// document.getElementById('map').map
