console.log("main_multi_2")

import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import {OrbitControls} from 
'three/examples/jsm/controls/OrbitControls.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from "https://esm.sh/three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "https://esm.sh/three/examples/jsm/postprocessing/GlitchPass";
import { OutputPass } from "https://esm.sh/three/examples/jsm/postprocessing/OutputPass";
import { ClearPass } from "https://esm.sh/three/examples/jsm/postprocessing/ClearPass";



function main() {

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


    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    console.log(window.innerWidth, window.innerHeight)
    document.body.appendChild( renderer.domElement );
    // renderer.setClearColor( 0x000000, 0. ); // the default
    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;

    // rt = render target
    const rtWidth = window.innerWidth;//2*512;
    const rtHeight = window.innerHeight;//2*512;
    // const renderTarget = new THREE.WebGLRenderTarget( rtWidth, rtHeight );
    // const renderTarget2 = new THREE.WebGLRenderTarget( rtWidth, rtHeight );

    // -----------------------------------------------------------
    // CAMERAS
    // -----------------------------------------------------------
    const fov = 75;
    const aspect = rtWidth / rtHeight;
    const near = 0.1;
    const far = 1000;

    const camera1 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    const cam_lookat = new THREE.Vector3( 0, 0, 0 );
    camera1.getWorldDirection(cam_lookat);
    const orbit1 = new OrbitControls(camera1, renderer.domElement);
    orbit1.enablePan = false
    orbit1.enableZoom = false
    camera1.position.z = 20;
    orbit1.update();

    const camera2 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera2.getWorldDirection(cam_lookat);
    const orbit2 = new OrbitControls(camera2, renderer.domElement);
    orbit2.enablePan = false
    orbit2.enableZoom = false
    camera2.position.z = 20;
    orbit2.update();

    const pass1Scene = new THREE.Scene();
    // We will add the camera to a group. Moving things around in VR get difficult otherwise
    var group1 = new THREE.Group()
    group1.add(camera1)
    // group.position.set(0, 0.1, 20)
    pass1Scene.add(group1)
    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        pass1Scene.add( light );
    }
    var box_geo = new THREE.BoxGeometry( 1, 1, 1 );
    var box_mat = new THREE.MeshPhongMaterial( { color: new THREE.Color( 'red' ) } );
    var box_mesh1 = new THREE.Mesh( box_geo, box_mat );  
    box_mesh1.position.x = 5;
    // pass1Scene.add( box_mesh1 );



    const pass2Scene = new THREE.Scene();
    // We will add the camera to a group. Moving things around in VR get difficult otherwise
    var group2 = new THREE.Group()
    group2.add(camera2)
    // group2.position.set(0, 0.1, 20)
    pass2Scene.add(group2)
    {
        const color = 0xFFFFFF;
        const intensity = 10;
        const light = new THREE.DirectionalLight( color, intensity );
        light.position.set( - 1, 2, 4 );
        // pass2Scene.add( light );
    }
    var sph_geo = new THREE.SphereGeometry( 4.8, 64, 64 );
    var sph_mat2 = new THREE.MeshStandardMaterial( { 
        //color: new THREE.Color( 'black' ) 
        emissive: new THREE.Color( 'black' ) ,
        emissiveIntensity: 1,
    } );
    var sph_mesh2 = new THREE.Mesh( sph_geo, sph_mat2 );    
    //sph_mesh2.position.x = 5;


    var option = "";

    if (option == "plane"){
        var mesh_star_BH = create_star_mesh(6, 1, "plane");
        mesh_star_BH.position.set( 0., 0., -7 );
        pass2Scene.add( sph_mesh2 );
        pass1Scene.add(mesh_star_BH);
    }else if (option == "torus"){
        var mesh_star_BH = create_star_mesh(6, 1, "torus");//plane");
        mesh_star_BH.position.set( 0., 0., 0. )
        mesh_star_BH.rotation.x = Math.PI/2. +0.4
        // mesh_star_BH.rotation. = 1.;
        pass1Scene.add(mesh_star_BH);
    }else if (option == "double"){
        var mesh_star_BH = create_star_mesh(2, 1, "");
        mesh_star_BH.position.set( -7, 0., 0. );
        var mesh_star_noBH = create_star_mesh(2, 0, "");
        mesh_star_noBH.position.set( 7., 0., 0. );
        pass2Scene.add( sph_mesh2 );
        pass1Scene.add(mesh_star_BH);
        pass1Scene.add(mesh_star_noBH);

    }else{
        var mesh_star_BH = create_star_mesh(2, 1, "");
        mesh_star_BH.position.set( 0., 0., -7 );
        // pass2Scene.add( sph_mesh2 );
        pass1Scene.add(mesh_star_BH);
    } 
    // Add object to the scene
    
    


    // pass2Scene.add( sph_mesh2 );
    // pass1Scene.add(mesh_star_BH);


    // ---
    // COMPOSER AND PASSES
    const composer = new EffectComposer( renderer );
    const clearPass = new ClearPass();
    // adding some passes
    const renderPass1 = new RenderPass( pass1Scene, camera1 );
    renderPass1.clear = false;
    renderPass1.clearDepth = false; // 
    const renderPass2 = new RenderPass( pass2Scene, camera2 );
    renderPass2.clear = false;
    renderPass2.clearDepth = false; // If true, this pass will always be in front!
    // const glitchPass = new GlitchPass();
    const outputPass = new OutputPass();


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

    // function render( time ) {

    //     time *= 0.001;

    //     if ( resizeRendererToDisplaySize( renderer ) ) {

    //       const canvas = renderer.domElement;
    //       camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //       camera.updateProjectionMatrix();

    //     }

    //     // const canvas = renderer.domElement;
    //     // // console.log(canvas.clientWidth, canvas.clientHeight)
    //     // camera1.aspect = canvas.clientWidth / canvas.clientHeight;
    //     // camera1.updateProjectionMatrix();
    //     // camera2.aspect = canvas.clientWidth / canvas.clientHeight;
    //     // camera2.updateProjectionMatrix();
    //     // orbit1.update();
    //     // orbit2.update();

    //     // box_mesh1.rotation.y = time;

    //     // composer.addPass(clearPass);
    //     // composer.addPass( renderPass1 );
    //     // composer.addPass( renderPass2 );
    //     // composer.addPass( outputPass );
    //     // composer.render(); // instead of renderer.render()
        
    //     renderer.render( pass1Scene, camera1 );

    //     requestAnimationFrame( render );

    // }

    // requestAnimationFrame( render );

    renderer.setAnimationLoop( function () {


        if ( resizeRendererToDisplaySize( renderer ) ) {

          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
          console.debug(renderer.domElement.clientWidth)

        }

        // const canvas = renderer.domElement;
        // // console.log(canvas.clientWidth, canvas.clientHeight)
        // camera1.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera1.updateProjectionMatrix();
        // camera2.aspect = canvas.clientWidth / canvas.clientHeight;
        // camera2.updateProjectionMatrix();
        // orbit1.update();
        // orbit2.update();

        // box_mesh1.rotation.y = time;


        composer.addPass(clearPass);
        composer.addPass( renderPass1 );
        composer.addPass( renderPass2 );
        composer.addPass( outputPass );
        composer.render(); // instead of renderer.render()
        
        // renderer.render( pass1Scene, camera1 );

    });


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
        u_width: {value: window.innerWidth},
        u_height: {value: window.innerHeight},
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
}

main();



