
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import {OrbitControls} from 
'three/examples/jsm/controls/OrbitControls.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';

// ------------------------------------------------------------------------------------
// INIT
// ------------------------------------------------------------------------------------

// ---------------------
// RENDERER & JS & VR
// ---------------------
// Setting up the renderer and XR
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

// ---------------------
// SCENE
// ---------------------
const scene = new THREE.Scene();

// ---------------------
// CAMERA
// ---------------------
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const cam_lookat = new THREE.Vector3( 0, 0, 0 );
camera.getWorldDirection(cam_lookat);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = false
orbit.enableZoom = false
camera.position.z = 20;
orbit.update();

// We will add the camera to a group. Moving things around in VR get difficult otherwise
var group = new THREE.Group()
group.add(camera)
// group.position.set(0, 0.1, 20)
scene.add(group)

// ---------------------
// LIGHTING
// ---------------------
const color = 0xFFFFFF;
const intensity = 6;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

// ---------------------
// CLOCK
// ---------------------
const clock = new THREE.Clock();

// ---------------------
// STRUCTURE OBJECTS
// ---------------------
// Empty to rotate around BH
const center_empty = new THREE.Object3D();
scene.add(center_empty);

// ---------------------
// SURFACE TEXTURES
// ---------------------
const star_texture = new THREE.TextureLoader().load('TEX/8k_sun.jpg')
star_texture.colorSpace = THREE.SRGBColorSpace;
const test_texture = new THREE.TextureLoader().load('TEX/test.png')

// ---------------------
// DISPLACEMENT TEXTURES
// ---------------------
const displacement_texture_20_round2 = new THREE.TextureLoader().load('LUTS/LUT_pp_ss_distance=20_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.09_6.67_-0.28_25.26_round_lp=2.png')
// console.log("tex", displacement_texture_20_round2)




// ------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------
function create_star_mesh(radius, image, shape) {

  if (shape == "torus"){
    var geo_star = new THREE.RingGeometry( radius, 2, 64, 100, 1000 ); // innerRadius : number, outerRadius : number, thetaSegments : number, phiSegments : number, thetaStart : number, thetaLength : number
    // var geo_star_no_grav = new THREE.TorusGeometry(radius, 2, 16, 100 ); //radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float) 
    var tex_to_use = star_texture
  }else if (shape == "plane"){
    var geo_star = new THREE.PlaneGeometry( 20, 20 );
    var tex_to_use = test_texture
  }else{
    var geo_star = new THREE.SphereGeometry( radius, 64, 64 ); //radius : Float, widthSegments : Integer, heightSegments : Integer
    var tex_to_use = star_texture
  }

  var tess= true
  if (tess) {
    var maxEdgeLength = 1.0
    var maxIterations = 10.
    var modifier = new TessellateModifier( 1.0, 10 );
    geo_star = modifier.modify( geo_star );
  }


  if (image == 1){


    var m_uniform = new THREE.Matrix4(); 
    m_uniform.set( 1, 0, 0, 0, 
                   0, 1, 0, 0,
                   0, 0, 1, 0, 
                   0, 0, 0, 1 );

    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.09
    var l_max = 6.67
    var p_min = -0.28
    var p_max = 25.26
    var distance = 20.
    var orbitStar = 5.
    var radiusStar = 1.0

    var uniforms = {
      u_time: {value: 0.0},
      u_matrix: {value: m_uniform},
      u_displacement_texture: {value: displacement_texture_20_round2},
      u_texture: {value: tex_to_use},
      cam_distance: {value: distance},
      uv_r_min : {value: r_min},
      uv_r_max : {value: r_max},
      uv_ph_min : {value: ph_min},
      uv_ph_max : {value: ph_max},
      uv_l_min : {value: l_min},
      uv_l_max : {value: l_max},
      uv_p_min : {value: p_min},
      uv_p_max : {value: p_max},
    }
    // console.log(document.getElementById('vertexshader').textContent)
    var material = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
      wireframe: false,
      uniforms:uniforms,
      side: THREE.DoubleSide
    });
  }else{
    var material =  new THREE.MeshStandardMaterial({
                    // color: '#0000FF',
                    // emissive: '#000000',
                    map: star_texture,
                    emissive: 0xffffff,
                    emissiveIntensity: 1,
                    emissiveMap: star_texture,
                    side: THREE.DoubleSide
                }); 
    // var material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );

  }



  material.needsUpdate = true;



  const mesh_star = new THREE.Mesh(
      geo_star,
      material
  );



  return mesh_star;
}


// ------------------------------------------------------------------------------------
// CONTENT
// ------------------------------------------------------------------------------------
// --------------------
// Black Hole Mesh for orientation
// --------------------
const BH_mat =  new THREE.MeshStandardMaterial({
                // color: '#d3d3d3',
                emissive: '#d3d3d3',
                opacity: 0.1,
                transparent: true,
            });
var geo_BH = new THREE.SphereGeometry( 2, 64, 64 ); //radius : Float, widthSegments : Integer, heightSegments : Integer
const mesh_BH = new THREE.Mesh( geo_BH, BH_mat );
mesh_BH.position.set( 0., 0., 0 )
// scene.add( mesh_BH );


var mesh_star_no_grav = create_star_mesh(5, 1, "plane");
mesh_star_no_grav.position.set( 0., 0., -20. )
// scene.add(mesh_star_no_grav);

// TEST SPHERE
var mesh_star_no_grav = create_star_mesh(10, 0, "");
mesh_star_no_grav.position.set( 0., 0., -100 )
// center_empty.add(mesh_star_no_grav);
// center_empty.position.set(0,0.1,20)

// var mesh_star_no_grav = create_star_mesh(1, 1, "");
// mesh_star_no_grav.position.set( 0., 0., -30 )
// center_empty.add(mesh_star_no_grav);

var mesh_star_no_grav = create_star_mesh(1, 1, "");
mesh_star_no_grav.position.set( -10., 0., -10 )
center_empty.add(mesh_star_no_grav);
// center_empty.position.set(0,0.1,20)


// ------------------------------------------------------------------------------------
// Rendering Loop
// ------------------------------------------------------------------------------------
renderer.setAnimationLoop( function () {
  // center_empty.rotation.y = clock.getElapsedTime()/2;// IF SPHERE

  // camera.position.set(0, 0, 20);

  const canvas = renderer.domElement;
  // console.log(canvas.clientWidth, canvas.clientHeight)
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  
  orbit.update();
  
  renderer.render( scene, camera );

} );

