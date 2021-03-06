// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/

var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

function initmap() {
  // set up the map
  map = new L.Map('map');

  // this is the old code for getting map data
  //var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  //var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  //var osm = new L.TileLayer(osmUrl, {minZoom: 8, attribution: osmAttrib}); 
  //map.addLayer(osm);  

  // start the map in Baton Rouge
  map.setView(new L.LatLng(30.42, -91.19),12);
  //this is the new code for getting map data, uses opensource project called provider
  L.tileLayer.provider('OpenStreetMap.HOT').addTo(map);



  //add control element
  var info = L.control();

  info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  };

  // method that we will use to update the control based on feature properties passed
  //~~~~~~~~~~~~~~~~~~~~~~~~~CHANGE THIS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  info.update = function (props) {
      this._div.innerHTML = '<h4>Some sort of descriptor</h4>' +  (props ?
          '<b>' + props.POLICE_DISTRICT_NO + '</b><br />'
          : 'Hover over a Zone');
  };

  info.addTo(map);



// get color depending on population density value
  function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
        d > 200  ? '#E31A1C' :
        d > 100  ? '#FC4E2A' :
        d > 50   ? '#FD8D3C' :
        d > 20   ? '#FEB24C' :
        d > 10   ? '#FED976' :
              '#FFEDA0';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CHANGE THIS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  function style(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(Math.floor(Math.random() * 1001)) //change this to use an actual metric
    };
  }



  //code for interacting with whatever you're hovering over
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    info.update(layer.feature.properties);
  }

  var geojson;

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }



  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      //POTENTIALLY CHANGE THIS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      labels = [],
      from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' +
        from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };

  legend.addTo(map);



  geojson = L.geoJson(districts, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}

initmap();