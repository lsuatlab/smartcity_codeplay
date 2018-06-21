// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Add stats bar
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );



// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000111");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Add a light
var light = new THREE.PointLight( 0xffffff, 10, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 50, 50, -50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 50, -50, 50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 50, -50, -50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( -50, 50, 50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( -50, 50, -50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( -50, -50, 50 );
scene.add( light );

var light = new THREE.PointLight( 0xffffff, 10, 100 );
light.position.set( -50, -50, -50 );
scene.add( light );

// Create a Cube Mesh with basic material

/*
var geometry = new THREE.BoxGeometry( 2, 3, 4 );
var material = new THREE.MeshNormalMaterial( { color: 0x2A9494 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
*/

// Add control
var controls = {
  size:1,
  color: 0x2A9494
}

var gui = new dat.GUI();
var c_mesh_size = gui.add(controls, 'size', 0,2);
var c_mesh_color = gui.addColor(controls, 'color', 0,100);

var geometry = new THREE.SphereGeometry(controls.size, Math.floor(controls.size * 16), Math.floor(controls.size * 16));
geometry.computeFaceNormals();
geometry.computeVertexNormals();
var material = new THREE.MeshLambertMaterial( { color: controls.color } );
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

c_mesh_size.onChange(function(){
  geometry = new THREE.SphereGeometry(controls.size, Math.floor(controls.size * 16), Math.floor(controls.size * 16));
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  mesh.geometry = geometry;
});

c_mesh_color.onChange(function(){
  mesh.material.color.setHex(controls.color);
});

/*
var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0x2A9494} );
var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
*/

// Render Loop
var render = function () {
  stats.begin();
  requestAnimationFrame( render );
  
  
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  

  // Render the scene
  renderer.render(scene, camera);
  stats.end();
};

render();