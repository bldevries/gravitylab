console.log("FSD")

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import {OrbitControls} from 
'three/examples/jsm/controls/OrbitControls.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';


// const bufScene = new THREE.Scene();


// const fov = 75;
// const aspect = 2;  // the canvas default
// const near = 0.1;
// const far = 5;
// const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// document.body.appendChild( VRButton.createButton( renderer ) );
// renderer.xr.enabled = true;


function main() {

  // -----------------------------------------------------------
  // RENDERER
  // -----------------------------------------------------------
  // const canvas = document.querySelector( '#c' );
  // const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor( 0x000000, 0. ); // the default
  const canvas = renderer.domElement;
  var gl = canvas.getContext("webgl2", {
    premultipliedAlpha: false  // Ask for non-premultiplied alpha
  });
  gl = canvas.getContext("webgl2", { alpha: false });
  //    <canvas style="background: red;"><canvas>

  // -----------------------------------------------------------
  // CAMERAS
  // -----------------------------------------------------------
  // rt = render target
  const rtWidth = window.innerWidth;//2*512;
  const rtHeight = window.innerHeight;//2*512;
  const renderTarget = new THREE.WebGLRenderTarget( rtWidth, rtHeight );
  const renderTarget2 = new THREE.WebGLRenderTarget( rtWidth, rtHeight );


  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 1000;
  const rtCamera = new THREE.PerspectiveCamera( rtFov, rtAspect, rtNear, rtFar );
  // rtCamera.position.z = 2;

  const cam_lookat = new THREE.Vector3( 0, 0, 0 );
  rtCamera.getWorldDirection(cam_lookat);
  const orbit = new OrbitControls(rtCamera, renderer.domElement);
  orbit.enablePan = false
  orbit.enableZoom = false
  rtCamera.position.z = 20;
  orbit.update();

  // FINAL ORTHO CAMERA
  var imageWidth = rtWidth;//1000.;
  var imageHeight = rtHeight;//imageWidth;//10.;
  //left : number, right : number, top : number, bottom : number, near : number, far : number
  const camera = new THREE.OrthographicCamera( imageWidth / - 2,
    imageWidth / 2,
    imageHeight / 2,
    imageHeight / - 2, -10000, 10000 );

  // -----------------------------------------------------------
  // TEXTURES
  // -----------------------------------------------------------

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
  // PASS1: FIRST RENDER PASS
  // ------------------------------------------------------------------------------------

  // -----------------------------------------------------------
  // PASS1: CAM AND TARGET SETUP AND SCENE
  // -----------------------------------------------------------


  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color( 'red' );


  // -----------------------------------------------------------
  // PASS1: CONTENT
  // -----------------------------------------------------------
  {

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    rtScene.add( light );

  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

  function makeInstance( geometry, color, x ) {

    const material = new THREE.MeshPhongMaterial( { color } );

    const cube = new THREE.Mesh( geometry, material );
    rtScene.add( cube );

    cube.position.x = x;

    return cube;

  }

  const rtCubes = [
    makeInstance( geometry, 0x44aa88, 0 ),
    makeInstance( geometry, 0x8844aa, - 1 ),
    makeInstance( geometry, 0xaa8844, 1),
  ];

  // var mesh_star_no_grav = create_star_mesh(5, 1, "");
  // mesh_star_no_grav.position.set( 0., 0., -20. )
  // rtScene.add(mesh_star_no_grav);


  // ------------------------------------------------------------------------------------
  // PASS2: SECOND RENDER PASS
  // ------------------------------------------------------------------------------------

  const rt2Scene = new THREE.Scene();
  // rt2Scene.background = new THREE.Color( 'red' );
  // rt2Scene.background = null;
  {

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    rt2Scene.add( light );

  }
  // var material = new THREE.ShaderMaterial({
  //   vertexShader: document.getElementById('vertexshader').textContent,
  //   fragmentShader: document.getElementById('fragmentshader').textContent,
  //   wireframe: false,
  //   uniforms:uniforms,
  //   side: THREE.DoubleSide
  // });


  var uniforms = {
          u_texture: {value: renderTarget},
        }
  var material = new THREE.MeshPhongMaterial( { color: new THREE.Color( 'red' )} );
  var shader_material = new THREE.ShaderMaterial({
          vertexShader: document.getElementById('vertexshaderRegions').textContent,
          fragmentShader: document.getElementById('fragmentshaderRegions').textContent,
          wireframe: false,
          uniforms:uniforms,
          side: THREE.DoubleSide
        });
  var cube2 = new THREE.Mesh( new THREE.PlaneGeometry( imageWidth, imageHeight ), shader_material );
  // rtScene.add( cube );
  // cube2.position.y=0.5;
  rt2Scene.add(cube2);

  // ------------------------------------------------------------------------------------
  // FINAL ORTHO RENDER
  //------------------------------------------------------------------------------------
  // Setup render-to-texture scene


  // const fov = 75;
  // const aspect = 2; // the canvas default
  // const near = 0.1;
  // const far = 5;
  // const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  // camera.position.z = 2;

  const scene = new THREE.Scene();

  {

    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    scene.add( light );

  }

  var material = new THREE.MeshPhongMaterial( {
    map: renderTarget.texture,
  } );
  var imagePlane_geo = new THREE.PlaneGeometry( imageWidth, imageHeight );
  var imagePlane_mesh = new THREE.Mesh( imagePlane_geo, material );
  imagePlane_mesh.position.z = -100;
  scene.add( imagePlane_mesh );

  var material = new THREE.MeshPhongMaterial( {
    map: renderTarget2.texture,
  } );
  var imagePlane_geo = new THREE.PlaneGeometry( imageWidth*0.2, imageHeight*0.2 );
  var imagePlane_mesh = new THREE.Mesh( imagePlane_geo, material );
  imagePlane_mesh.position.z = -99;
  imagePlane_mesh.position.y = 200.;
  imagePlane_mesh.position.x = 200.;
  scene.add( imagePlane_mesh );

  function resizeRendererToDisplaySize( renderer ) {

    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if ( needResize ) {

      renderer.setSize( width, height, false );

    }

    return needResize;

  }

  function render( time ) {

    time *= 0.001;

    if ( resizeRendererToDisplaySize( renderer ) ) {

      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();

    }

    // rotate all the cubes in the render target scene
    rtCubes.forEach( ( cube, ndx ) => {

      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;

    } );

    orbit.update();


    // draw render target scene to render target
    renderer.setRenderTarget( renderTarget );
    renderer.render( rtScene, rtCamera );
    renderer.setRenderTarget( renderTarget2 );
    renderer.render( rt2Scene, rtCamera );
    renderer.setRenderTarget( null );

    // rotate the cube in the scene
    // cube2.rotation.x = time;
    // cube2.rotation.y = time * 1.1;

    // render the scene to the canvas
    renderer.render( scene, camera );

    requestAnimationFrame( render );

  }

  requestAnimationFrame( render );

}

main();
