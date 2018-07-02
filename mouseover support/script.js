			var camera, scene, raycaster, renderer, stats;
			var mouse = new THREE.Vector2(), INTERSECTED;;
			var oControls;

			init();
			animate();

			function init() {

			  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

			  scene = new THREE.Scene();
			  scene.background = new THREE.Color( 0xf0f0f0 );

			  var light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

			  //test code
			  raycaster = new THREE.Raycaster();
			  renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
			  document.getElementById('container').appendChild(renderer.domElement);
			  stats = new Stats();

			  //orbit controls
				oControls = new THREE.OrbitControls( camera, renderer.domElement );

			  window.addEventListener('resize', onWindowResize, false);
			  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			  document.addEventListener( 'mousedown', onDocumentMouseClick, false );
			  document.addEventListener( 'keydown', onDocumentKeyDown, false );
			  console.log(scene.children);
			}

			function onWindowResize() {
			  camera.aspect = window.innerWidth / window.innerHeight;
			  camera.updateProjectionMatrix();
			  renderer.setSize(window.innerWidth, window.innerHeight);
			  oControls.reset();

			}

			function onDocumentMouseMove( event ) {
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			}

			function onDocumentMouseClick( event ) {
				// find intersections
				camera.lookAt( scene.position );
				camera.updateMatrixWorld();
				oControls.reset();

				raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( scene.children );
				if ( intersects.length > 0 ) {
					if ( INTERSECTED != intersects[ intersects.length -1 ].object ) {
						if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
						INTERSECTED = intersects[ intersects.length -1 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
						INTERSECTED.material.color.setHex( 0xff0000 );
					}
				} else {
					if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
					INTERSECTED = null;
				}
			}

			function onDocumentKeyDown( event ) {
				var geometry = new THREE.CircleGeometry( Math.random() * 10, 32 );
				var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
				var sphere = new THREE.Mesh( geometry, material );
			  sphere.position.x = camera.position.x + Math.random() * 20 -10;
			  sphere.position.y = camera.position.y + Math.random() * 20 -10;
			  sphere.position.z = camera.position.z -50;
			  scene.add(sphere);
			  if(scene.children.length == 2)
			  {
			  	prevObj = scene.children[1];
			  	console.log(prevObj);
			  	prevColor = prevObj.material.color.getHex();
			  }
			}

			function animate() {
				oControls.reset();
			  requestAnimationFrame(animate);
				renderer.render(scene, camera);
				stats.update();
			}