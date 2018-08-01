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
};

function onDocumentKeyDown( event ) {
  if(current < listOfKeys.length)
  {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( objects );
    if ( intersects.length > 0 ) {
      var temp = intersects[ 0 ].point;
      pointMappings[listOfKeys[current]] = [temp.x, temp.y, temp.z];
      console.log(listOfKeys[current] + ": " + pointMappings[listOfKeys[current]]);
      current++;
      if (current == listOfKeys.length)
      {
        console.log(JSON.stringify(pointMappings, null, 2));
      } 
  	} else {
	      console.log("no object detected");
    }
    console.log("-----------------------------------\n"); 
  }
};

function onDocumentMouseMove( event ) {	       
  sceneOrtho.remove(sceneOrtho.getObjectByName("spriteyX"));
  sceneOrtho.remove(sceneOrtho.getObjectByName("spriteyY"));
  sceneOrtho.remove(sceneOrtho.getObjectByName("spriteyZ"));
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    sphere.position.copy( intersects[ 0 ].point );
    scene.add( sphere );

    var spritey = makeTextSprite( "X: " + intersects[ 0 ].point.x + " ", 
      { fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
    spritey.name = "spriteyX";
    spritey.position.set(window.innerWidth/2, -window.innerHeight/2, 1);
    sceneOrtho.add( spritey );

    spritey = makeTextSprite( "Y: " + intersects[ 0 ].point.y + " ", 
      { fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
    spritey.name = "spriteyY";
    spritey.position.set(window.innerWidth/2, -window.innerHeight/2 -50, 1);
    sceneOrtho.add( spritey );

    spritey = makeTextSprite( "Z: " + intersects[ 0 ].point.z + " ", 
      { fontsize: 30, fontface: "Georgia", borderColor: {r:0, g:0, b:0, a:1.0} } );
    spritey.name = "spriteyZ";
    spritey.position.set(window.innerWidth/2, -window.innerHeight/2 -100, 1);
    sceneOrtho.add( spritey );
  }
  else {
    scene.remove(scene.getObjectByName("location"));
  }
};

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

  //that last value in the list is maxWidth so have it be reasonably big
  context.fillText( message, 0, fontsize + borderThickness, 300);

  var texture = new THREE.Texture(canvas) 
  texture.needsUpdate = true;

  var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
  var sprite = new THREE.Sprite( spriteMaterial );
  sprite.scale.set(spriteMaterial.map.image.width, spriteMaterial.map.image.height, 1);
  sprite.center.set( 1, 0 );
  return sprite;  
};

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
};



var getTexture = function (filename) {
  var loader = new THREE.TextureLoader();
  //loader.crossOrigin = null;
  //var texture = loader.load( 'images/' + filename );

  var texture = loader.load(filename);
  return texture;
};

function createSprite(filename, color) {
    var spriteMaterial = new THREE.SpriteMaterial({
                //opacity: opacity,
                color: color,
                //transparent: transparent,
                map: getTexture(filename)
            });
    var sprite = new THREE.Sprite(spriteMaterial);
    return sprite;
};


function makeTextFile(text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
};

function writeTextFile(filepath, output) {
  var txtFile = new File(filepath);
  txtFile.open("w"); //
  txtFile.writeln(output);
  txtFile.close();
}