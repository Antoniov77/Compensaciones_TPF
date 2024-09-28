//inicio el mapa en la coordenada con zoom
var map = L.map('map').setView([7.886198, -76.638171], 14);

//inicio mapa base de un proveedor (OSM)


var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

//Informacion cartográfica
var marker = L.marker([6.25484462914192, -75.56880157138656]).addTo(map);
marker.bindPopup("<b>My House</b><br>Sleeping.").openPopup();
var circle = L.circle([6.258333632795123, -75.5890883494063], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 100
}).addTo(map);
circle.bindPopup("Estadio.");
var polygon = L.polygon([
    [6.257376737981914, -75.5931837210265],
    [6.2563146228551965, -75.59416126630174],
    [6.2561790335347105, -75.59284271686072]
]).addTo(map);
polygon.bindPopup("Villa");

var baseMaps = {
    "OpenStreetMap": osm,
    "OpenStreetMap.HOT": osmHOT,
    "Esri_WorldImagery":Esri_WorldImagery
};

var overlayMaps = {
    "marker": marker,
    "circle": circle,
    "polygon": polygon

};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

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

var stilos_barrio_med = {
    radius: 8,
    fillColor: "#FF0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

 // Función de estilo para personalizar el color de los barrios
function estiloBarrio(feature) {
    var baseStyle = {
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    // Ajustar el color en función del nombre del barrio
    switch (feature.properties.nombre_bar) {
        case 'Laureles':   // Cambia 'Laureles' por el nombre real del barrio en el GeoJSON
            baseStyle.color = '#ff0000';  // Color rojo para el borde
            baseStyle.fillColor = '#ffb3b3';  // Color de relleno rojo claro
            break;
        case 'La Floresta':
            baseStyle.color = '#00ff00';  // Color verde para el borde
            baseStyle.fillColor = '#b3ffb3';  // Color de relleno verde claro
            break;
        case 'Las Palmas':
            baseStyle.color = '#0000ff';  // Color azul para el borde
            baseStyle.fillColor = '#b3b3ff';  // Color de relleno azul claro
            break;
        default:
            baseStyle.color = '#cccccc';  // Color gris para el borde
            baseStyle.fillColor = '#e6e6e6';  // Color de relleno gris claro
    }
    return baseStyle;
}


var stilovias = {
    radius: 8,
    fillColor: "#FF0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

var customIcon = L.icon({
    iconUrl: 'GeoJSON1/camara.png',  // Ruta a la imagen del icono
    iconSize: [32, 32],               // Tamaño del ícono (ancho, alto)
    iconAnchor: [16, 32],             // Punto de anclaje del ícono (coordenadas en la imagen)
    popupAnchor: [0, -32]             // Punto de anclaje del popup relativo al ícono
});


var camaras;

fetch('GeoJSON1/camarasgj.geojson')
.then(response => response.json())
.then(data => {
// Añadir el GeoJSON al mapa con estilos y eventos
 camaras = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        // Crear un marcador con el ícono personalizado
        return L.marker(latlng, { icon: customIcon });
    },

    style: stilovias,
    onEachFeature: function (feature, layer) {
        // Añadir popups para los barrios
        if (feature.properties &&  feature.properties.link_foto) {
            layer.bindPopup('<img src="' + feature.properties.link_foto + '" alt="" style="width: 300px;"><p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt reiciendis eius quia vel unde harum cum omnis cumque eaque praesentium consequuntur aperiam, quo facere, ut vitae ex repellendus aut ad?</p>');
        }
    }
}).addTo(map);
        // Agregar la capa GeoJSON al control de capas
        layerControl.addOverlay(camaras, 'CCTV Medellín');
})
.catch(err => console.error('Error cargando el archivo GeoJSON: ', err));

var vias;

fetch('GeoJSON1/jerarquia_vialgj.json')
.then(response => response.json())
.then(data => {
// Añadir el GeoJSON al mapa con estilos y eventos
 vias = L.geoJSON(data, {
    style: stilovias,
    onEachFeature: function (feature, layer) {
        // Añadir popups para los barrios
        if (feature.properties && feature.properties.nombre_vias) {
          layer.bindPopup("vias: " + feature.properties.nombre_vias);
        }
      }

     }).addTo(map);

     layerControl.addOverlay(vias, 'Calles Medellín')
})