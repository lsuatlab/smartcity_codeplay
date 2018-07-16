var camera, cameraOrtho, scene, sceneOrtho, renderer;
var controls, stats, raycaster, oControls;
var mouse = new THREE.Vector2(), INTERSECTED, label;
var scaling = 1/4;

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

//I got these points by using the XYZ coordinate finder
var pointMappings = {
	"1A-1" : [-2.758205765715369, 0.8728485772248413, 0.5413649851482558],
	"1A-2" : [-2.6134509862969653, 1.170650612493624, 0.24356294987947172],
	"2A-1" : [-3.056139851615709, 0.4760384083547766, 0.9381751540183206],
	"2A-2" : [-2.427346878440767, 0.5112462439568604, 0.9029673184162367],
	"2A-3" : [-1.9095948133588894, 0.5151153498851803, 0.8990982124879167],
	"3A-1" : [0.5631664279282327, 1.5863879196963582, -0.172174357323262],
	"3A-2" : [1.4660362076324038, 1.6402105097528898, -0.2259969473797951],
	"3A-3" : [2.0431514784779274, 1.6911038989950098, -0.2768903366219153],
	"4A-1" : [-3.126, 3.274, -1.860],
	"4A-2" : [-2.558, 3.364, -1.5],
	"1B-1" : [-1.9411014268058766, 0.9456492590272306, 0.468564303345865],
	"1B-2" : [-1.9866864039833378, 1.3865792399908878, 0.027634322382207862],
	"2B-1" : [-1.1751374470611968, 0.5964988602780041, 0.8177147020950926],
	"2B-2" : [-1.3613209375967832, 0.07455216461482239, 1.339661397758273],
	"2B-3" : [-0.7425419046623812, -0.20269780460100306, 1.616911366974098],
	"2B-4" : [-0.27571349173794085, 0.51214064984651, 0.9020729125265851],
	"3B-1" : [0.7978912841384372, 1.1488934406430558, 0.2653201217300402],
	"3B-2" : [1.3837514962721453, 1.2040919232473732, 0.21012163912572254],
	"4B-1" : [-2.246, 3.092, -1.678],
	"4B-2" : [-1.519, 3.236, -1.822],
	"4B-3" : [-1.859, 3.929, -2.515],
	"1C-1" : [-1.139980112382154, 0.9396791956476043, 0.47453436672549104],
	"1C-2" : [-1.203177437939117, 1.2698906111186146, 0.14432295125448075],
	"1C-3" : [-1.2021265937634475, 1.501502693416716, -0.08728913104361906],
	"2C-1" : [-3.0367936801121638, -0.06661514165613136, 1.480828704029226],
	"2C-2" : [-3.2697819059449986, -0.6970337853547413, 2.111247347727837],
	"2C-3" : [-2.946577308875996, -1.4110756578063737, 2.825289220179469],
	"3C-1" : [1.3049315426214596, 0.7051732888919279, 0.7090402734811679],
	"3C-2" : [1.5247846057162169, 0.3584867012876855, 1.055726861085409],
	"3C-3" : [1.704409572434434, 0.006961320085578482, 1.407252242287517],
	"4C-1" : [-2.055, 2.742, -1.328],
	"4C-2" : [-1.437, 2.737, -1.323],
	"1D-1" : [-0.33808330462046526, 1.075724199301062, 0.3384893630720332],
	"1D-2" : [0.06424038741505857, 1.1804965327777075, 0.2337170295953874],
	"1D-3" : [-0.4177789479039342, 1.5195266006344472, -0.10531303826135205],
	"2D-1" : [-2.5207877589888557, 0.05454613026629884, 1.359667432106797],
	"2D-2" : [-2.1073316575184964, -0.28264015340236803, 1.6968537157754635],
	"2D-3" : [-1.7167136699756598, -0.6158149505297037, 2.0300285129027986],
	"3D-1" : [1.9872076266990313, 1.221626121604909, 0.19258744076818524],
	"3D-2" : [2.69132986528171, 1.239944637658221, 0.1742689247148731],
	"3D-3" : [3.7600479456970057, 1.3473413483408905, 0.0668722140322032],
	"4D-1" : [-0.872, 2.784, -1.370],
	"4D-2" : [-0.660, 2.516, -1.102],
	"1E-1" : [-2.078401363099489, 1.6954470003689144, -0.28123343799581857],
	"1E-2" : [-2.009374955700881, 1.9354295160378105, -0.5212159536647147],
	"2E-1" : [-0.7903096669346739, -0.6412334666390513, 2.0554470290121465],
	"2E-2" : [-1.2906992552477017, -1.1053446686158908, 2.519558230988985],
	"2E-3" : [-0.30454363209477264, -1.2724241709213604, 2.6866377332944547],
	"2E-4" : [0.24829018750724063, -1.411007018209681, 2.825220580582776],
	"2E-5" : [-2.126720087269955, -2.034814327781166, 3.4490278901542615],
	"3E-1" : [2.0070914934349515, 0.680163121522259, 0.7340504408508366],
	"3E-2" : [2.0865222761506117, 0.17941927494378673, 1.2347942874293074],
	"3E-3" : [2.8042696898452775, 0.8805784654317805, 0.5336350969413148],
	"3E-4" : [2.669355920928702, 0.5795371346439576, 0.8346764277291364],
	"3E-5" : [2.7871152107274106, 0.3225930738428557, 1.0916204885302396],
	"4E-1" : [-1.920, 2.303, -0.889],
	"4E-2" : [-1.551, 2.280, -0.865],
	"1F-1" : [-1.4745919130010163, 1.837708110379092, -0.42349454800599634],
	"1F-2" : [-0.7087789442296043, 1.8770802400549635, -0.4628666776818682],
	"2F-1" : [1.0106828206623903, -1.1082421505855677, 2.522455712958662],
	"3F-1" : [3.666408872667262, 0.23798930557929615, 1.1762242567937975],
	"3F-2" : [2.8508875242773555, -0.1381873385815362, 1.5524009009546313],
	"3F-3" : [2.791077782354777, -0.7349776476440799, 2.1491912100171753],
	"4F-1" : [-1.246, 2.276, -0.862],
	"4F-2" : [-0.750, 2.261, -0.847],
	"3G-1" : [0.5171356070293092, 0.4725332380068857, 0.9416803243662103],
	"3G-2" : [-0.043137597801682685, -0.06035531754560142, 1.4745688799186962],
	"3G-3" : [1.1492256564269296, -0.12843278569398642, 1.5426463480670822],
	"3H-1" : [2.0729043117798325, -1.5949968684267966, 3.009210430799892],
}

var geometry = new THREE.SphereGeometry( .25, 32, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00,
                                          transparent: true,
                                          opacity: 0.3} );
var sphere = new THREE.Mesh( geometry, material );
sphere.scale.x = sphere.scale.y = scaling;
sphere.name = "location";

const originalWarn = console.warn.bind( console );
console.warn = (text) => !text.includes('THREE') && originalWarn(text);

init();
animate();

function init() {

	//stats for debug purposes
	/*
	stats = new Stats();
	stats.showPanel( 0 );
	document.body.appendChild( stats.dom );
	*/

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
  THREE.ImageUtils.crossOrigin = null;
  var loader = new THREE.TextureLoader(); 
  var texture = loader.load('image/mapTexture.png');
  //var texture = loader.load('  https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Vizcacha_in_the_Atacama.jpg/250px-Vizcacha_in_the_Atacama.jpg');
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
  cube.name = "Map of Baton Rouge";                  
  scene.add( cube ); 
  objects.push( cube );
  particlesTotal++;

	//makes sprites
  var object;

  //remove this in later builds, adds flair by randomizing colors for crimes
  Object.keys(colors).forEach(function(key) {
  	colors[key] = Math.random() * 0xffffff;
  })

  var counter, listOfKeys;
  counter = scaling;


	crimeData.features.forEach(function(data) {
		listOfKeys = Object.keys(data.properties.CRIME_INDEX);
    counter = scaling;
		//we start at 1 because I've laid out the data in such a way that the first value
		//is Total which we can ignore
		for(var i = 1; i < listOfKeys.length; i++)
		{
			for(var j = 0; j < data.properties.CRIME_INDEX[listOfKeys[i]]; j++)
			{
				object = new createSprite(
            'https://upload.wikimedia.org/wikipedia/commons/0/00/WX_circle_white.png', 
            colors[listOfKeys[i]]);
        object.position.set(
        		pointMappings[data.properties.POLICE_DISTRICT_NO][0] ,
        		pointMappings[data.properties.POLICE_DISTRICT_NO][1] + counter/2,
        		pointMappings[data.properties.POLICE_DISTRICT_NO][2] + counter/2,
        		);
        console.log(object.position);
        counter += scaling;
        object.name = listOfKeys[i];
        object.scale.set(scaling, scaling, scaling);
        scene.add(object);
        objects.push(object);
        particlesTotal++;
			}
		} 
	})
	var count = particlesTotal;
  console.log(count);
  cube.rotation.set(0, -Math.PI/2, Math.PI/4);

  //orbit controls
	oControls = new THREE.OrbitControls( camera, renderer.domElement );

	// Raycaster
  raycaster = new THREE.Raycaster();

	//events
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function animate() {

  requestAnimationFrame(animate);

  var time = performance.now();

  renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	renderer.render( sceneOrtho, cameraOrtho );

}