			var camera, scene, raycaster, renderer, stats;
			var mouse = new THREE.Vector2(), INTERSECTED;;
			var oControls;
			var text2;

			init();
			animate();

			function init() {

			  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );

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

			  //stats, dont work 
			  stats = new Stats();

			  //orbit controls, dont work 
				oControls = new THREE.OrbitControls( camera, renderer.domElement );

			  window.addEventListener('resize', onWindowResize, false);
			  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			  document.addEventListener( 'mousedown', onDocumentMouseClick, false );
			  document.addEventListener( 'keydown', onDocumentKeyDown, false );
			  text2 = document.createElement('div' );
						text2.setAttribute("id", "nametag");
						text2.style.position = 'absolute';
						//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
						text2.style.width = 100;
						text2.style.height = 35;
						text2.style.backgroundColor = "black";
						text2.style.color = "white"
						text2.innerHTML = "Hit any button to continue";
						text2.style.top = 100 + 'px';
						text2.style.left = 100 + 'px';
						document.body.appendChild(text2);

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
				if(!!document.getElementById("nametag"))
				{
					document.body.removeChild(document.getElementById("nametag"));
				}
				camera.lookAt( scene.position );
				camera.updateMatrixWorld();
				oControls.reset();

				raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( scene.children );
				if ( intersects.length > 0 ) {
					if ( INTERSECTED != intersects[ intersects.length -1 ].object ) {
						if ( INTERSECTED ) {
							INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
						}
						INTERSECTED = intersects[ intersects.length -1 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
						INTERSECTED.material.color.setHex( 0xff0000 );

						var temp = deteremineScreenCoordinate(INTERSECTED);

						text2 = document.createElement('div' );
						text2.setAttribute("id", "nametag");
						text2.style.position = 'absolute';
						//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
						text2.style.width = 100;
						text2.style.height = 35;
						text2.style.backgroundColor = "black";
						text2.style.color = "white"
						text2.innerHTML = "I wish I had brain cells";
						text2.style.top = temp.x + 'px';
						text2.style.left = temp.y + 'px';
						document.body.appendChild(text2);
					}
				} else {
					if ( INTERSECTED ) {
						INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
					}
					INTERSECTED = null;
				}
			}

			//function from three.js cookbook github
			//If I assume this works then my camera is really messed up
			function deteremineScreenCoordinate(object) {
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(object.matrixWorld);
        vector.project(camera);
        var width = window.innerWidth, height = window.innerHeight;
        var widthHalf = width / 2, heightHalf = height / 2;
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = -( vector.y * heightHalf ) + heightHalf;
        return vector;
    	}

			function onDocumentKeyDown( event ) {
				var geometry = new THREE.CircleGeometry( Math.random() * 20, 32 );
				var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
				var sphere = new THREE.Mesh( geometry, material );
			  sphere.position.x = camera.position.x + Math.random() * 120 -60;
			  sphere.position.y = camera.position.y + Math.random() * 120 -60;
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
				stats.update();
			  requestAnimationFrame(animate);
				renderer.render(scene, camera);
			}