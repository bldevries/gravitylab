console.log("33333")
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


    // -----------------------------------------------------------
    // CAMERAS
    // -----------------------------------------------------------
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
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

    var option = "";
    var grav_on = 1;

    if (option == "plane"){
        var mesh_star_BH = create_star_mesh(6, 1, "plane");
        mesh_star_BH.position.set( 0., 0., -7 );
        pass1Scene.add(mesh_star_BH);
    }else if (option == "torus"){
        var mesh_star_BH = create_star_mesh(6, 1, "torus");//plane");
        mesh_star_BH.position.set( 0., 0., 0. )
        mesh_star_BH.rotation.x = Math.PI/2. +0.4
        pass1Scene.add(mesh_star_BH);
    }else if (option == "double"){
        var mesh_star_BH = create_star_mesh(2, 1, "");
        mesh_star_BH.position.set( 7, 0., -3. );
        var mesh_star_noBH = create_star_mesh(2, 1, "");
        mesh_star_noBH.position.set( 7., 0., 0. );
        pass1Scene.add(mesh_star_BH);
        pass1Scene.add(mesh_star_noBH);

    }else{
        if (grav_on == 1){
            var mesh_star_BH = create_star_mesh(2, 1, "");
        }else{
            var mesh_star_BH = create_star_mesh(2, 0, "");
        }
        mesh_star_BH.position.set( 0., 0., -7 );
        pass1Scene.add(mesh_star_BH);

        var mesh_star_BH = create_star_mesh(2, 1, "");
        mesh_star_BH.position.set( 0., 7., -7 );
        // pass1Scene.add(mesh_star_BH);
    } 




    var sph_geo = new THREE.SphereGeometry( 4.8, 64, 64 );
    var sph_mat2 = new THREE.MeshStandardMaterial( { 
        //color: new THREE.Color( 'black' ) 
        emissive: new THREE.Color( 'white' ) ,
        emissiveIntensity: 1,
    } );
    // var sph_mesh2 = new THREE.Mesh( sph_geo, sph_mat2 );    
    // sph_mesh2.position.set( 0., 0., 0. );
    // pass1Scene.add(sph_mesh2)

    // var uniforms = {
    // }
    // var material = new THREE.ShaderMaterial({
    //     vertexShader: document.getElementById('vertexshaderRegions').textContent,
    //     fragmentShader: document.getElementById('fragmentshaderRegions').textContent,
    //     wireframe: false,
    //     uniforms:uniforms,
    //     side: THREE.DoubleSide
    // });
    // var sph_mesh2 = new THREE.Mesh( sph_geo, material );    
    // sph_mesh2.position.set( 0., 0., 1. );
    // pass1Scene.add(sph_mesh2)



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

    renderer.setAnimationLoop( function () {


        if ( resizeRendererToDisplaySize( renderer ) ) {

          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
          console.debug(renderer.domElement.clientWidth)

        }



        renderer.render( pass1Scene, camera1 );

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
      var r_min = 2.4
      var r_max = 35
      var ph_min = 0.
      var ph_max = 3.141591653589793
      var l_min = -2.09
      var l_max = 6.67
      var p_min = -0.28
      var p_max = 25.26
      
      var uniforms = {
        u_width: {value: window.innerWidth},
        u_height: {value: window.innerHeight},
        u_displacement_texture: {value: displacement_texture_20_round2},
        u_texture: {value: tex_to_use},
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



