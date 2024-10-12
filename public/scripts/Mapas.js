// Inicializar el mapa
var map = L.map('map').setView([6.268658, -75.565801], 13);

// Mapas base
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var baseMaps = {
    "OpenStreetMap": osm,
    "Esri World Imagery": Esri_WorldImagery,
    "Mapa Hot": osmHOT
};

// Control de capas para los overlays
var overlayMaps = {};

var marker = L.marker([6.25484462914192, -75.56880157138656]).addTo(map);
marker.bindPopup("<b>My House</b><br>Sleeping.").openPopup();
var circle = L.circle([7.885946, -76.636965], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 50
}).addTo(map);
circle.bindPopup("Colegio.");
var polygon = L.polygon([
    [7.885858, -76.6342048],
    [7.885224, -76.632084],
    [7.883922, -76.632437]
]).addTo(map);
polygon.bindPopup("Éxito.");

var frontera;
// cargar el archivo GeoJSON

fetch ('GeoJSON1/barrios_medellin.geojson')
    .then(response => response.json())
    .then(data => {
    // Añadir el GeoJSON al mapa con estilos y eventos
     frontera = L.geoJSON(data, {
        style: estiloBarrio,
        onEachFeature: function (feature, layer) {
            // Añadir popups para los barrios
            if (feature.properties && feature.properties.nombre_bar) {
              layer.bindPopup("Barrio: " + feature.properties.nombre_bar);
            }
          }
        }).addTo(map);

        layerControl.addOverlay(frontera, 'Barrios de Medellín')
    })
    .catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

    var estiloBarrio = {
        radius: 8,
        fillColor: "#FF0000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

// Agregar control de capas al mapa
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Función para cargar tablas con geometría y agregarlas al control de capas
fetch('/tablasgeo')
  .then(response => response.json())
  .then(tablas => {
    console.log('Tablas con geometría:', tablas); // Verifica la estructura de los datos

    tablas.forEach(tabla => {
      var nombreTabla = tabla.table_name;

      // Crear una capa vacía para esta tabla y añadirla al control de capas
      var layer = L.layerGroup();
      console.log('Añadiendo capa:', nombreTabla); // Verifica que se están añadiendo las capas
      layerControl.addOverlay(layer, nombreTabla); // Añadir al control de capas

      // Escuchar cuando el usuario activa la capa en el control
      map.on('overlayadd', function(event) {
        if (event.name === nombreTabla) {
          console.log('Cargando datos para la tabla:', nombreTabla); // Verifica que la tabla esté siendo seleccionada

          // Cargar los datos de la tabla y mostrarlos en el mapa
          fetch(`/tablas/${nombreTabla}`)
            .then(response => response.json())
            .then(data => {
              console.log('Datos GeoJSON para', nombreTabla, data); // Verifica los datos recibidos
              var geoLayer = L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                  if (feature.properties) {
                    layer.bindPopup(JSON.stringify(feature.properties)); // Personaliza el popup si lo deseas
                  }
                }
              });
              layer.addLayer(geoLayer); // Añadir los datos a la capa
            })
            .catch(err => console.error('Error cargando los datos de la tabla:', err));
        }
      });

      // Escuchar cuando el usuario desactiva la capa en el control
      map.on('overlayremove', function(event) {
        if (event.name === nombreTabla) {
          layer.clearLayers();  // Limpia la capa cuando se desactiva
        }
      });
    });
  })
  .catch(err => console.error('Error obteniendo las tablas con geometría:', err));

// Minimapa
var miniMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var miniMap = new L.Control.MiniMap(miniMapLayer, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomleft'
}).addTo(map);