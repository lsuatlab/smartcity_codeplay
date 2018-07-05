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
  info.update = function (props) {
    this._div.innerHTML = '<h4>Safety Metric</h4>' +  (props ?
        '<b>' + props.POLICE_DISTRICT_NO + '</b><br />' + (props.CRIME_INDEX.TOTAL == 0 ? 'No Crime data' :
            'Total Crime Score: ' + props.CRIME_INDEX.TOTAL)
        : 'Hover over a Zone');
  };

  info.addTo(map);


var ColorSet = ['#420268','#5d0062','#73005d','#890057','#9f0151','#b4064a','#c80d44','#dc143c'];
// get color depending on population density value
  function getColor(d) {
    return d > 300 ? ColorSet[0] :
        d > 200  ? ColorSet[1] :
        d > 100  ? ColorSet[2] :
        d > 70  ? ColorSet[3] :
        d > 50   ? ColorSet[4] :
        d > 30   ? ColorSet[5] :
        d > 15   ? ColorSet[6] :
              ColorSet[7];
  }

  function style(feature) {
    return {
      weight: 1,
      opacity: 0.5,
      color: '#B7E0E5',
      dashArray: '1',
      fillOpacity: 1,
      fillColor: getColor(feature.properties.CRIME_INDEX.TOTAL)
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
      grades = [0, 15, 30, 50, 70, 100, 200, 300],
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



  geojson = L.geoJson(crimeData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}

initmap();