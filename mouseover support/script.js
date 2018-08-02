init();
animate();

var stats, controls, raycaster;
var scene, camera, renderer;
var mouse = new THREE.Vector2(), INTERSECTED, label;

function init () {
 
 		stats = new Stats();
		stats.showPanel( 0 );
		document.body.appendChild( stats.dom );
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
 
    // Camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
 
    // Orbit Controls
    controls = new THREE.OrbitControls(camera);
    //controls.enableDamping = true;
		//controls.dampingFactor = 0;
 
    // Render
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight );
    document.getElementById('demo').appendChild(renderer.domElement);

    // Raycaster
    raycaster = new THREE.Raycaster();

    // Events
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseClick, false );
 
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.reset();
}

function onDocumentKeyDown( event ) {
	var geometry = new THREE.CircleGeometry( Math.random() * 20, 32 );
	var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
	var sphere = new THREE.Mesh( geometry, material );
  sphere.position.x = camera.position.x + Math.random() * 120 -60;
  sphere.position.y = camera.position.y + Math.random() * 120 -60;
  sphere.position.z = camera.position.z -50;
  scene.add(sphere);
}

function onDocumentMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentMouseClick( event ) {
	// find intersections
	camera.lookAt( scene.position );
	camera.updateMatrixWorld();

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ intersects.length -1 ].object ) {
			if ( INTERSECTED ) {
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
				scene.remove(scene.getObjectByName("spritey"));
			}
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.color.setHex( 0xff0000 );

			var spritey = makeTextSprite( " It Works ", 
				{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
					spritey.position.set(INTERSECTED.position.x, INTERSECTED.position.y, INTERSECTED.position.z + 3);
			spritey.name = "spritey";
			scene.add( spritey );
		}
	} else {
		if ( INTERSECTED ) {
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			scene.remove(scene.getObjectByName("spritey"));
		}
		INTERSECTED = null;
	}
}

//Weird function used to make sprites out of text. Thank you github user mcode
//slightly modified to removed older parameters that aren't used anymore

function makeTextSprite( message, parameters )
{
  if ( parameters === undefined ) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
  var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
  var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
  var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
  var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = "Bold " + fontsize + "px " + fontface;
  var metrics = context.measureText( message );
  var textWidth = metrics.width;

  context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

  context.lineWidth = borderThickness;
  roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

  context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
  context.fillText( message, borderThickness, fontsize + borderThickness);

  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
  return sprite;  
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function animate() {
	stats.begin();

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  stats.end();

};