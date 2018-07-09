var camera, scene, renderer;
var controls, stats, raycaster, oControls;
var mouse = new THREE.Vector2(), INTERSECTED, label;

var particlesTotal = 250;
var positions = [];
var objects = [];
var current = 0;

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

  //camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 50000);
  camera.position.set(0, 0, 30 * particlesTotal );
  camera.lookAt(scene.position);

  //render
  renderer = new THREE.WebGLRenderer();
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

	//makes sprites
  var test = document.createElement('img');
  var image = document.createElement('img');
  image.addEventListener('load', function(event) {

    for (var i = 0; i < particlesTotal; i++) {
    	var object;
    	(i == 0) ? object = new createSprite('sam.png') : object = new createSprite('sam.png');
      object.position.x = Math.random() * 4000 - 2000,
      object.position.y = Math.random() * 4000 - 2000,
      object.position.z = Math.random() * 4000 - 2000;
      object.scale.set(100,100,1);
      //object.position.x = object.position.y = object.position.z = 0
      scene.add(object);
      objects.push(object);

    }

    transition();

  }, false);
  image.src = 'images/metal-sphere-small.png';
  test.src = 'images/sam.png';

  console.log(objects);
  
  //sphere pattern here
  var radius = particlesTotal * 5;
  for (var i = 0; i < particlesTotal; i++) {
    var phi = Math.acos(-1 + (2 * i) / particlesTotal);
    var theta = Math.sqrt(particlesTotal /2 * Math.PI) * phi;
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }

}

function transition() {

  var offset = current * particlesTotal * 30;
  var duration = 2000;

  for (var i = 0, j = offset; i < particlesTotal; i++, j += 3) {

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
  

  renderer.render(scene, camera);

}