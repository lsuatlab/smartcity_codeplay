var camera, cameraOrtho, scene, sceneOrtho, renderer;
var controls, stats, raycaster, oControls;
var textFile = null;
var mouse = new THREE.Vector2(), INTERSECTED, label;
var listOfKeys = Object.keys(pointMappings);
var particlesTotal = 0;
var positions = [];
var objects = [];
var current = 0;
var colors = {
	"ASSAULT" : 0xffffff,
	"BATTERY" : 0x00ced1,
	"BUSINESS ROBBERY" : 0xff99ff,
	"CRIMINAL DAMAGE TO PROPERTY" : 0x9af7a5,
	"FIREARM" : 0x725394,
	"HOMICIDE" : 0xeeff7f,
	"INDIVIDUAL ROBBERY" : 0xffffff,
	"JUVENILE" : 0xa2a2d0,
	"NARCOTICS" : 0xa2a2d0,
	"NON-RESIDENTIAL BURGLARY" : 0xa2a2d0,
	"NUISANCE" : 0xa2a2d0,
	"OTHER" : 0x99cc99,
	"RESIDENTIAL BURGLARY" : 0xa2a2d0,
	"SEXUAL ASSAULT" : 0xa2a2d0,
	"THEFT" : 0xa2a2d0,
	"VEHICLE BURGLARY" : 0xa2a2d0,
	"VICE" : 0xa2a2d0,
}

var geometry = new THREE.SphereGeometry( .25, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00,
                                              transparent: true,
                                              opacity: 0.7} );
  var sphere = new THREE.Mesh( geometry, material );
  sphere.scale.x = sphere.scale.y = 1/8;
  sphere.name = "location"


const originalWarn = console.warn.bind( console )
console.warn = (text) => !text.includes('THREE') && originalWarn(text);

init();
animate();

function init() {

	//scene
	scene = new THREE.Scene();
	sceneOrtho = new THREE.Scene();

   //camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 0, 10 );
  camera.lookAt(scene.position);

  cameraOrtho = new THREE.OrthographicCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  cameraOrtho.position.set(0, 0, 10 );
  cameraOrtho.lookAt(scene.position);

  cameraOrtho.left = - window.innerWidth / 2;
  cameraOrtho.right = window.innerWidth / 2;
  cameraOrtho.top = window.innerHeight / 2;
  cameraOrtho.bottom = - window.innerHeight / 2;
  cameraOrtho.updateProjectionMatrix();

  //render
  renderer = new THREE.WebGLRenderer();
  renderer.autoClear = false; 
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);

	//makes a box
  //THREE.ImageUtils.crossOrigin = '';
  var loader = new THREE.TextureLoader(); 
  var texture = loader.load('https://lsuatlab.github.io/smartcity_codeplay/imageConfig/image/mapTexture.PNG');
  texture.anisotropy = renderer.getMaxAnisotropy();

  var cubeMaterial = new THREE.MeshFaceMaterial([
          new THREE.MeshBasicMaterial({
              map: texture //left
          }),
          new THREE.MeshBasicMaterial({
              color: 'orange' //right
          }),
          new THREE.MeshBasicMaterial({

              color: 'green' // top
          }),
          new THREE.MeshBasicMaterial({
              color:'blue' // bottom
          }),
          new THREE.MeshBasicMaterial({
              color: 'pink' // front
          }),
          new THREE.MeshBasicMaterial({
              color: 'yellow' //back
          })
  ]);

  var cubeGeometry = new THREE.CubeGeometry(2,10,10);                          
  let  cube = new THREE.Mesh(cubeGeometry, cubeMaterial); 
  cube.name = "image";
  cube.rotation.set(0, -Math.PI /2, Math.PI /4);                  
  scene.add( cube ); 
  objects.push( cube );
  particlesTotal++;
    

  var count = particlesTotal;

  //orbit controls
	oControls = new THREE.OrbitControls( camera, renderer.domElement );

	// Raycaster
  raycaster = new THREE.Raycaster();

	//events
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'keydown', onDocumentKeyDown, false );

}

function animate() {

  requestAnimationFrame(animate);

  var time = performance.now();
  if(current < listOfKeys.length)
  {
  sceneOrtho.remove(sceneOrtho.getObjectByName("spritey"));
  var spritey = makeTextSprite( " Enter: " + listOfKeys[current] + " ", 
      { fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
    spritey.name = "spritey";
    spritey.position.set(window.innerWidth/2, window.innerHeight/4, 1);
    sceneOrtho.add( spritey );
  } else {
    sceneOrtho.remove(sceneOrtho.getObjectByName("spritey"));
    var spritey = makeTextSprite( " Done! Check console log ", 
      { fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
    spritey.name = "spritey";
    spritey.position.set(window.innerWidth/2, window.innerHeight/4, 1);
    sceneOrtho.add( spritey );
  }

  renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	renderer.render( sceneOrtho, cameraOrtho );

}