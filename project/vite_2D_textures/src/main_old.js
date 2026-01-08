console.log("ASFASF")


import * as THREE from 'three';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {OrbitControls} from 
'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);




// Sending a texture to the shader
const star_texture = new THREE.TextureLoader().load('./src/TEX/8k_sun.jpg')
const star_texture_em = new THREE.TextureLoader().load('./src/TEX/8k_sun.jpg')
star_texture_em.colorSpace = THREE.SRGBColorSpace;
const moon_texture = new THREE.TextureLoader().load('./src/TEX/8k_moon.jpg')
// const displacement_texture = new THREE.TextureLoader().load('./lin_tex_2d.png')

var add_dir = "./src"
const displacement_texture_20_im2 = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=20_image_nr=2_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-76.83514757137354_3.383158252857733_-52.67205176743512_0.0_round_lp=None.png')

const displacement_texture_20_round2 = new THREE.TextureLoader().load(   add_dir+'/LUTS/LUT_pp_ss_distance=20_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.09_6.67_-0.28_25.26_round_lp=2.png')
const displacement_texture_20_roundNO = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=20_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.086896172828767_6.666000832520734_-0.28076220758038417_25.25537907153734_round_lp=None.png')
const displacement_texture_10_round1 = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=10_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-1.1_14.0_-1.0_33.2_round_lp=1.png')
const displacement_texture_10_roundNO = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=10_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-1.1177376568280866_13.999064930419756_-0.9576605993458712_33.18713707522482_round_lp=None.png')
const displacement_texture_30_roundNO = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.3125471441473358_4.187739221382774_-0.04536005480354177_21.847880848105227_round_lp=None.png')
const displacement_texture_30_round2 = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.31_4.19_-0.05_21.85_round_lp=2.png')
const displacement_texture_30_round1 = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.3_4.2_0.0_21.8_round_lp=1.png')
const displacement_texture_30_new = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_35_r_res_10_ph_res_10_eps_r_1e-06.pkl_-2.3125471441473358_4.187739221382774_-0.04536005480354177_21.847880848105227.png')
const displacement_texture_10_new = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=10_image_nr=1_r_range_15_r_res_10_ph_res_10_eps_r_1e-06.pkl_-1.1177376568280866_5.999569593534012_-0.16114266750702555_18.038681679917925.png')
const displacement_texture_10_high = new THREE.TextureLoader().load(   './LUTS/LUT_pp_ss_distance=10_image_nr=1_r_range_50_r_res_400_ph_res_400_eps_r_1e-06.pkl_-1.1177376568280866_20.029907490152837_-1.5906492164414772_44.4152985118104.png')
displacement_texture_10_high.minFilter = THREE.LinearMipmapLinearFilter;
const displacement_texture_10_100 = new THREE.TextureLoader().load('./LUTS/LUT_pp_ss_distance=10_image_nr=1_r_range_100_r_res_20_ph_res_20_eps_r_1e-06.pkl_-1.1177376568280866_39.561630030078206_-3.51040108276824_81.6966509439221.png')
const displacement_texture_20_300 = new THREE.TextureLoader().load('./LUTS/LUT_pp_ss_distance=20_image_nr=1_r_range_300_r_res_20_ph_res_20_eps_r_1e-06.pkl_-2.086896172828767_58.185539706938414_-5.3749619186484665_162.92044448024328.png');
const displacement_texture_20_high = new THREE.TextureLoader().load('./LUTS/LUT_pp_ss_distance=20_image_nr=1_r_range_50_r_res_400_ph_res_400_eps_r_1e-06.pkl_-2.086896172828767_9.69119477989797_-0.588292416680133_33.189329609974706.png')
const displacement_texture_30 = new THREE.TextureLoader().load(    './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_300_r_res_20_ph_res_20_eps_r_1e-06.pkl_-2.3125471441473358_38.729189165814944_-3.3943620138899746_132.41549165800353.png');

// const displacement_texture_30_2 = new THREE.TextureLoader().load(    './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_50_r_res_100_ph_res_100_eps_r_1e-06.pkl_-2.3125471441473358_6.255711484230083_-0.24602020479322562_28.3080276134326.png')
const displacement_texture_30_2 = new THREE.TextureLoader().load(    './LUTS/LUT_pp_ss_distance=30_image_nr=1_r_range_50_r_res_100_ph_res_300_eps_r_1e-06.pkl_-2.3125471441473358_6.255711484230083_-0.24602020479322562_28.3080276134326.png')

// function setTextureAndDistance(nr){

// function loadTextures(nr){
    // var nr="20_300";
var display_object = "sphere"//"sphere"//"torus"
var rotation = false
// var nr = "30_round1"
// var nr = "20_round2"
var nr = "20"
var nr_im2 = "20_im2"


switch(nr_im2) {
  case "20_im2":
    var displacement_texture_im2 = displacement_texture_20_im2
    var r_min_im2 = 2.4
    var r_max_im2 = 35
    var ph_min_im2 = 0.
    var ph_max_im2 = 3.141591653589793
    var l_min_im2 = -76.83514757137354
    var l_max_im2 = 3.383158252857733
    var p_min_im2 = -52.67205176743512
    var p_max_im2 = 0.0
    var distance_im2 = 20.
    var orbitStar_im2 = 5.
    var radiusStar_im2 = 1.0
    break;
}

switch(nr) {

  case "10":
    console.log("10_roundNO")
    var displacement_texture = displacement_texture_10_roundNO
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -1.1177376568280866
    var l_max = 13.999064930419756
    var p_min = -0.9576605993458712
    var p_max = 33.18713707522482
    var distance = 10.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "20":
    console.log("20_round2")
    var displacement_texture = displacement_texture_20_round2
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
    break;

  case "30":
    console.log("30_roundNO")
    var displacement_texture = displacement_texture_30_roundNO
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.31
    var l_max = 4.19
    var p_min = -0.05
    var p_max = 21.85
    var distance = 30.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;

  case "20_roundNO":
    console.log("20_roundNO")
    var displacement_texture = displacement_texture_20_roundNO
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.086896172828767
    var l_max = 6.666000832520734
    var p_min = -0.28076220758038417
    var p_max = 25.25537907153734
    var distance = 20.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;



  case "10_round1":
    console.log("10_round1")
    var displacement_texture = displacement_texture_10_round1
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -1.1
    var l_max = 14.0
    var p_min = -1.0
    var p_max = 33.2
    var distance = 10.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;

  case "30_round2":
    console.log("30_round2")
    var displacement_texture = displacement_texture_30_round2
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.31
    var l_max = 4.19
    var p_min = -0.05
    var p_max = 21.85
    var distance = 30.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "30_round1":
    console.log("30_round1")
    var displacement_texture = displacement_texture_30_round1
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.3
    var l_max = 4.2
    var p_min = 0.0
    var p_max = 21.8
    var distance = 30.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "30_new":
    console.log("distance 10_100_2")
    var displacement_texture = displacement_texture_30_new
    var r_min = 2.4
    var r_max = 35
    var ph_min = 0.
    var ph_max = 3.141591653589793
    var l_min = -2.3125471441473358
    var l_max = 4.187739221382774
    var p_min = -0.04536005480354177
    var p_max = 21.847880848105227
    var distance = 30.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "10_new":
    console.log("distance 10_100_2")
    var displacement_texture = displacement_texture_10_new
    var r_min = 2.4
    var r_max = 15
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var l_min = -1.1177376568280866
    var l_max = 5.999569593534012
    var p_min = -0.16114266750702555
    var p_max = 18.038681679917925
    var distance = 10.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "10_2":
    console.log("distance 10_100_2")
    var displacement_texture = displacement_texture_10_100
    var r_min = 2.4
    var r_max = 100
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var l_min = -1.1177376568280866
    var l_max = 39.561630030078206
    var p_min = -3.51040108276824
    var p_max = 81.6966509439221
    var distance = 10.
    var orbitStar = 5.
    var radiusStar = 1.0
    break;
  case "10_high":
    console.log("distance 10")
    var displacement_texture = displacement_texture_10_high
    var r_min = 2.4
    var r_max = 50
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var l_min = -1.1177376568280866
    var l_max = 20.029907490152837
    var p_min = -1.5906492164414772
    var p_max = 44.4152985118104
    var distance = 10.
    var orbitStar = 3.
    var radiusStar = 1.0
    break;
  case "20":
    console.log("distance 20_300")
    var displacement_texture = displacement_texture_20_300
    var r_min = 2.4
    var r_max = 300
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var l_min = -2.086896172828767
    var l_max = 58.185539706938414
    var p_min = -5.3749619186484665
    var p_max = 162.92044448024328
    var distance = 20.
    var orbitStar = 3.
    var radiusStar = 1.0
    break;
  case "20_high":
    console.log("distance 20_300")
    var displacement_texture = displacement_texture_20_high
    var r_min = 2.4
    var r_max = 50
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var l_min = -2.086896172828767
    var l_max = 9.69119477989797
    var p_min = -0.588292416680133
    var p_max = 33.189329609974706
    var distance = 20.
    var orbitStar = 3.
    var radiusStar = 1.0
    break;
  case "30":
    console.log("distance 30_300")
    var displacement_texture = displacement_texture_30
    var l_min = -2.3125471441473358
    var l_max = 38.729189165814944
    var p_min = -3.3943620138899746
    var p_max = 132.41549165800353
    var r_min = 2.4
    var r_max = 300
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var distance = 30.
    var orbitStar = 3.
    var radiusStar = 1.0

  case "30_2":
    console.log("distance 30 2")
    var displacement_texture = displacement_texture_30_2
    var l_min = -2.3125471441473358
    var l_max = 6.255711484230083
    var p_min = -0.24602020479322562
    var p_max = 28.3080276134326
    var r_min = 2.4
    var r_max = 50
    var ph_min = 1e-06
    var ph_max = 3.141591653589793
    var distance = 30.
    var orbitStar = 3.
    var radiusStar = 1.0
}





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(//fov : Number, aspect : Number, near : Number, far : Number
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Get camera direction
const cam_lookat = new THREE.Vector3( 0, 0, 0 );
camera.getWorldDirection(cam_lookat);
// console.log("cam_lookat", cam_lookat);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = false
orbit.enableZoom = false
// Camera positioning
camera.position.set(distance, 0, 0);

// orbit.rotation.z = 10
orbit.update();


// --------------------
// Adding an empty for the orbit
// --------------------
const center_empty = new THREE.Object3D();
scene.add(center_empty);

// --------------------
// Adding an empty for the orbit
// // --------------------
// const camera_empty = new THREE.Object3D();
// scene.add(camera_empty);
// camera_empty.add(camera)


// --------------------
// Adding an empty for the orbit
// --------------------
const radius = radiusStar
const radius_orbit = orbitStar
// const geometry = new THREE.PlaneGeometry( 1, 1 );


var geo_sphere = new THREE.SphereGeometry( radius, 128, 128 ); //radius : Float, widthSegments : Integer, heightSegments : Integer
var geo_torus = new THREE.TorusGeometry(5, 1, 16, 100 ); //radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float) 
if (display_object == "sphere"){
  var geometry = geo_sphere
}else{
  var geometry = geo_torus
}

// const geometry = new THREE.PlaneGeometry(10, 10, 30, 30); //width : Float, height : Float, widthSegments : Integer, heightSegments : Integer

// A matrix uniform you could pass to the shader
const m_uniform = new THREE.Matrix4(); 
m_uniform.set( 1, 0, 0, 0, 
               0, 1, 0, 0,
               0, 0, 1, 0, 
               0, 0, 0, 1 );


const uniforms = {
    u_time: {value: 0.0},
    u_matrix: {value: m_uniform},
    u_displacement_texture: {value: displacement_texture},
    u_texture: {value: star_texture},
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

const uniforms_im2 = {
    u_time: {value: 0.0},
    u_matrix: {value: m_uniform},
    u_displacement_texture: {value: displacement_texture_im2},
    u_texture: {value: star_texture},
    cam_distance: {value: distance_im2},
    uv_r_min : {value: r_min_im2},
    uv_r_max : {value: r_max_im2},
    uv_ph_min : {value: ph_min_im2},
    uv_ph_max : {value: ph_max_im2},
    uv_l_min : {value: l_min_im2},
    uv_l_max : {value: l_max_im2},
    uv_p_min : {value: p_min_im2},
    uv_p_max : {value: p_max_im2},
}

// Making a material with custom shaders
var customMaterial = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    wireframe: false,
    uniforms:uniforms
});

// Making a material with custom shaders
var customMaterial_im2 = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,
    wireframe: false,
    uniforms:uniforms_im2
});

customMaterial.needsUpdate = true;
// Making a geometry
var geomesh = new THREE.Mesh(
    geometry,
    customMaterial
);

customMaterial_im2.needsUpdate = true;
// Making a geometry
var geomesh_im2 = new THREE.Mesh(
    geometry,
    customMaterial_im2
);

if (display_object == "sphere"){
  geomesh.position.set( radius_orbit, 0, 0 ) // if sphere
  geomesh_im2.position.set( radius_orbit, 0, 0 ) // if sphere

}else{
  geomesh.position.set( 0, 0, 0 ) // if torus
}

// Adding the geometry to the center_empty
center_empty.add(geomesh);
// center_empty.add(geomesh_im2);




// --------------------
// Unaltered mesh
// --------------------
// const BH_geo = new THREE.SphereGeometry( 2, 32, 16 ); //radius : Float, widthSegments : Integer, heightSegments : Integer
var unal_mat =  new THREE.MeshStandardMaterial({
                // color: '#0000FF',
                // emissive: '#000000',
                map: star_texture_em,
                emissive: 0xffffff,
                emissiveIntensity: 1,
                emissiveMap: star_texture_em,
            });
const unal_mesh = new THREE.Mesh(
    geometry,
    unal_mat
);
unal_mesh.position.set( radius_orbit-0., 0, 0 )


// scene.add(unal_mesh);
center_empty.add(unal_mesh);


// --------------------
// Visual Anchor mesh
// --------------------

const anchor_geom1 = new THREE.TorusGeometry( 0.5, 0.05, 16, 100 ); //radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float) 
const anchor_mat1 = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const anchor_mesh1 = new THREE.Mesh( anchor_geom1, anchor_mat1 ); 
anchor_mesh1.position.set( 0., 0, 15 )
anchor_mesh1.rotation.x = 1/2*Math.PI
scene.add(anchor_mesh1);

const anchor_geom2 = new THREE.TorusGeometry( 0.5, 0.05, 16, 100 ); //radius : Float, tube : Float, radialSegments : Integer, tubularSegments : Integer, arc : Float) 
const anchor_mat2 = new THREE.MeshBasicMaterial( { color: '#0000FF' } ); 
const anchor_mesh2 = new THREE.Mesh( anchor_geom2, anchor_mat2 ); 
anchor_mesh2.position.set( 0., 0, 15 )
anchor_mesh2.rotation.x = 1/2*Math.PI
anchor_mesh2.rotation.y = 1/2*Math.PI
scene.add(anchor_mesh2);

const geometryplane = new THREE.PlaneGeometry( 1, 1 );
const materialplane = new THREE.MeshBasicMaterial( {map: displacement_texture_10_100 , side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometryplane, materialplane );
plane.rotation.y=0.5*Math.PI
plane.position.set(5.,0,0)
// scene.add( plane );


// --------------------
// Black Hole Mesh
// --------------------
const BH_geo = new THREE.SphereGeometry( 3.0, 32, 16 ); //radius : Float, widthSegments : Integer, heightSegments : Integer
const BH_mat =  new THREE.MeshStandardMaterial({
                color: '#FFFFFF',
                emissive: '#FFFFFF'
            });
const BH_mesh = new THREE.Mesh(
    BH_geo,
    BH_mat
);

// scene.add(BH_mesh);

if (display_object == "sphere"){
  center_empty.rotation.y = 0.81*Math.PI // IF SPHERE
}else{
  center_empty.rotation.x = Math.PI/2. // IF TORUS
}




// --------------------
// Do the animation and rendering
// --------------------
const clock = new THREE.Clock();
function animate() {

    //geomesh.position.x = clock.getElapsedTime()/1;
    
    if (rotation){
      if (display_object == "sphere"){
        console.log('spher rot')
        center_empty.rotation.y = clock.getElapsedTime()/3;// IF SPHERE
      }else{
        center_empty.rotation.z = clock.getElapsedTime()/3;// IF TORUS
      }
    }

    uniforms.u_time.value = clock.getElapsedTime();
    // m.setPosition(clock.getElapsedTime(), 0, 0);
    // m.makeRotationY( clock.getElapsedTime() );

    orbit.update();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 87: // W
            console.log("W");
            loadTextures("10_100");
            break;
        // case 65: // A
        //     camera.position.x -= 0.1;
        //     break;
        case 83: // S
            console.log("S")
            break;
        // case 68: // D
        //     camera.position.x += 0.1;
        //     break;
        case 49: // 1
          if (rotation) {
            rotation = false
          }else{
            rotation = true
          }
            console.log("S")
            break;
        case 50: //1
          console.log('change mat')
          if (geomesh.material == customMaterial){
            geomesh.material = unal_mat
          }else{
            geomesh.material = customMaterial
          }
          // rotation=true
          break;
        
        case 51: //2
          console.log('change mat')
          if (geomesh.geometry == geo_torus){
            rotation = false

            geomesh.geometry = geo_sphere
            geomesh.position.set( radius_orbit, 0, 0 ) // if sphere
            display_object = "sphere"
            center_empty.position.set( 0, 0, 0 ) // if sphere
            center_empty.rotation.y = 0
            center_empty.rotation.x = 0.
            center_empty.rotation.z = 0.



          }else{
            display_object = "torus"
            rotation = false

            geomesh.geometry = geo_torus
            geomesh.position.set( 0, 0, 0 ) // if torus
            center_empty.rotation.x = Math.PI/2. // IF TORUS

          }
          // rotation=true
          break;


        // case 68: // D
        //     camera.position.x += 0.1;
        //     break;
    }
});



// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// // const geometry = new THREE.BoxGeometry( .1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// // const cube = new THREE.Mesh( geometry, material );
// // scene.add( cube );

// camera.position.z = 5;





// const material_cust = new THREE.ShaderMaterial( {

// 	uniforms: {
// 		time: { value: 1.0 },
// 		resolution: { value: new THREE.Vector2() }
// 	},

// 	vertexShader: document.getElementById( 'vertex-shader' ).textContent,
// 	// vertexShader: document.getElementById( 'vertexShader' ).textContent,
// 	fragmentShader: document.getElementById( 'fragmentShader' ).textContent

// } );

// const geometry = new THREE.BoxGeometry( .5, .5, .5 );
// const cube2 = new THREE.Mesh( geometry, material_cust );
// scene.add( cube2 );


// function animate() {
//   renderer.render( scene, camera );
// }
// renderer.setAnimationLoop( animate );