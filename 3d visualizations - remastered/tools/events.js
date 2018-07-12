function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrtho.left = - width / 2;
  cameraOrtho.right = width / 2;
  cameraOrtho.top = height / 2;
  cameraOrtho.bottom = - height / 2;
  cameraOrtho.updateProjectionMatrix();

  if(sceneOrtho.getObjectByName("spritey") != null)
  {
    sceneOrtho.getObjectByName("spritey")
        .position.set(width/2, -height/2, 1);
  }

  renderer.setSize( window.innerWidth, window.innerHeight );
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
    if ( INTERSECTED ) {
        INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
    }
    sceneOrtho.remove(sceneOrtho.getObjectByName("spritey"));
		if ( INTERSECTED != intersects[ 0 ].object ) {
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			INTERSECTED.material.color.setHex( 0xff0000 );

			var spritey = makeTextSprite( " It Work but ", 
				{ fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
			//spritey.position.set(INTERSECTED.position.x, INTERSECTED.position.y, INTERSECTED.position.z + 5);
      spritey.name = "spritey";
      spritey.position.set(window.innerWidth/2, -window.innerHeight/2, 1);
			sceneOrtho.add( spritey );
      //sceneOrtho.getObjectByName("spritey").position.set(0, 0, 1);
		}
	} 
}

//Weird function used to make sprites out of text. Thank you github user mcode
//slightly modified to removed older parameters that aren't used anymore

function makeTextSprite( message, parameters )
{
  if ( parameters === undefined ) parameters = {};
  var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
  var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 1;
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
  roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness), fontsize * 1.4 + borderThickness, 6);

  context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
  context.fillText( message, borderThickness, fontsize + borderThickness);

  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
  var sprite = new THREE.Sprite( spriteMaterial );
  //sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
  sprite.scale.set(spriteMaterial.map.image.width, spriteMaterial.map.image.height, 1);
  //sprite.center.set( 0,1 );
  sprite.center.set( 1, 0 );
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



var getTexture = function (filename) {
  var loader = new THREE.TextureLoader();
  //loader.crossOrigin = null;
  //var texture = loader.load( 'images/' + filename );
  var texture = loader.load( 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Circle_Fulvous_Solid.svg/200px-Circle_Fulvous_Solid.svg.png');
  return texture;
};

function createSprite(filename) {
            var spriteMaterial = new THREE.SpriteMaterial({
                        //opacity: opacity,
                        color: 0xffffff,
                        //transparent: transparent,
                        map: getTexture(filename)
                    });
            // we have 1 row, with five sprites
            //spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
            //spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
            //spriteMaterial.depthTest = false;
            //spriteMaterial.blending = THREE.AdditiveBlending;
            var sprite = new THREE.Sprite(spriteMaterial);
            //sprite.scale.set(size, size, size);
            //sprite.velocityX = 5;
            return sprite;
        }