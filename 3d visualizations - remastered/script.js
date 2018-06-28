			var camera, scene, renderer;
			var controls;

			var particlesTotal = 252;
			var positions = [];
			var objects = [];
			var current = 0;

			init();
			animate();

			function init() {

			  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
			  camera.position.set(600, 400, particlesTotal * 15);
			  camera.lookAt(new THREE.Vector3());

			  scene = new THREE.Scene();

			  var test = document.createElement('img');
			  var image = document.createElement('img');
			  image.addEventListener('load', function(event) {

			    for (var i = 0; i < particlesTotal; i++) {
			    	var object;
			    	(i % 2 == 0) ? object = new THREE.CSS3DSprite(image.cloneNode()) : object = new THREE.CSS3DSprite(test.cloneNode());
			      //var object = new THREE.CSS3DSprite(image.cloneNode());
			      object.position.x = Math.random() * 4000 - 2000,
		        object.position.y = Math.random() * 4000 - 2000,
		        object.position.z = Math.random() * 4000 - 2000;
			      scene.add(object);
			      objects.push(object);

			    }

			    transition();

			  }, false);
			  image.src = 'images/metal-sphere-small.png';
			  test.src = 'images/sam.png';
			  
			  // Sphere

			  var radius = particlesTotal * 10;

			  for (var i = 0; i < particlesTotal; i++) {

			    var phi = Math.acos(-1 + (2 * i) / particlesTotal);
			    var theta = Math.sqrt(particlesTotal * Math.PI) * phi;

			    positions.push(
			      radius * Math.cos(theta) * Math.sin(phi),
			      radius * Math.sin(theta) * Math.sin(phi),
			      radius * Math.cos(phi)
			    );

			  }

			  //

			  renderer = new THREE.CSS3DRenderer();
			  renderer.setSize(window.innerWidth, window.innerHeight);
			  renderer.domElement.style.position = 'absolute';
			  document.getElementById('container').appendChild(renderer.domElement);

			  //orbit controls
				var oControls = new THREE.OrbitControls( camera, renderer.domElement );

			  window.addEventListener('resize', onWindowResize, false);

			}

			function onWindowResize() {

			  camera.aspect = window.innerWidth / window.innerHeight;
			  camera.updateProjectionMatrix();

			  renderer.setSize(window.innerWidth, window.innerHeight);

			}

			function transition() {

			  var offset = current * particlesTotal * 3;
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