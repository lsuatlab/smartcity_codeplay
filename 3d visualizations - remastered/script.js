var camera, cameraOrtho, scene, sceneOrtho, renderer;
var controls, stats, raycaster, oControls;
var mouse = new THREE.Vector2(), INTERSECTED, label;

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

const originalWarn = console.warn.bind( console )
console.warn = (text) => !text.includes('THREE') && originalWarn(text);

init();
animate();

function init() {

	//stats
	stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );

	//scene
	scene = new THREE.Scene();
	sceneOrtho = new THREE.Scene();

	//makes sprites
  var image = document.createElement('img');
  var object;
  /*
  crimeData.features.forEach(function(data) {
		console.log(Object.keys(data.properties.CRIME_INDEX));
	})
	*/

	//console.log(crimeData)
  image.addEventListener('load', function(event) {

  	crimeData.features.forEach(function(data) {
			var listOfKeys = Object.keys(data.properties.CRIME_INDEX);
			//we start at 1 because I've laid out the data in such a way that the first value
			//is Total which we can ignore
			for(var i = 1; i < listOfKeys.length; i++)
			{
				console.log(listOfKeys[i]);
				//console.log(data.properties.CRIME_INDEX[listOfKeys[i]]);
				for(var j = 0; j < data.properties.CRIME_INDEX[listOfKeys[i]]; j++)
				{
					object = new createSprite('Remember to change the createSprite method', colors[listOfKeys[i]]);
		      object.position.x = Math.random() * 4000 - 2000,
		      object.position.y = Math.random() * 4000 - 2000,
		      object.position.z = Math.random() * 4000 - 2000;
		      object.name = listOfKeys[i];
		      object.scale.set(100,100,1);
		      scene.add(object);
		      objects.push(object);
		      particlesTotal++;
				}
			} 
		})
		var count = particlesTotal;
    transition(count);

  }, false);
  image.src = 'images/metal-sphere-small.png';

  //camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 0, 10000 );
  camera.lookAt(scene.position);

  cameraOrtho = new THREE.OrthographicCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  cameraOrtho.position.set(0, 0, 10 );
  cameraOrtho.lookAt(scene.position);

  //quick fix cuz im lazy. 
  //cameraOrtho isn't created properly but its late and this is my quick fix
  //until I have enough brain cells to do geometry again
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

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

  //orbit controls
	oControls = new THREE.OrbitControls( camera, renderer.domElement );

	// Raycaster
  raycaster = new THREE.Raycaster();

	//events
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mousedown', onDocumentMouseClick, false );

  console.log(objects);
  
  //sphere pattern here
  var radius = particlesTotal * 5;
  for (var i = 0; i < particlesTotal; i++) {
    var phi = Math.acos(-1 + (2 * i) / (1 * particlesTotal));
    var theta = Math.sqrt(1 * particlesTotal * Math.PI) * phi;
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }

}

function transition(count) {

  var offset = current * count * 30;
  var duration = 2000;

  var radius = count * 5;
  for (var i = 0; i < count; i++) {
    var phi = Math.acos(-1 + (2 * i) / (1 * count));
    var theta = Math.sqrt(1 * count * Math.PI) * phi;
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }

  for (var i = 0, j = offset; i < count; i++, j += 3) {

    var object = objects[i];

    new TWEEN.Tween(object.position)
      .to({
        x: positions[j],
        y: positions[j + 1],
        z: positions[j + 2]
      }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  }

  new TWEEN.Tween(this)
    .to({}, duration * 3)
    .onComplete(transition)
    .start();

  current = (current + 1) % 4;

}

function animate() {

  requestAnimationFrame(animate);

  TWEEN.update();

  var time = performance.now();

  /*
  for (var i = 0, l = objects.length; i < l; i++) {

    var object = objects[i];
    var scale = Math.sin((Math.floor(object.position.x) + time) * 0.002) * 0.3 + 1;
    object.scale.set(scale, scale, scale);
  }
  */
  

  renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	renderer.render( sceneOrtho, cameraOrtho );

}