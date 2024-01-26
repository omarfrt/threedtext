import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer"
import  {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass"
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper)
/**
 * enviroment map
 */
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('./enviroment/03.hdr',(enviromentMap)=>{
// enviromentMap.mapping = THREE.EquirectangularReflectionMapping;
// scene.background = enviromentMap;
// scene.environment = enviromentMap;
// })
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const fontLoader = new FontLoader()
// maybe return font on onload callback then use it in textGeometry it should rotate then 
let neoText;
fontLoader.load('/fonts/CommitMono_Regular.json',
(font)=>{
    const textGeometry = new TextGeometry(
        'Omar Fertat',{
            font:font,
            size:1,
            height:0.2,
            curveSegments:40,
            bevelEnabled:true,
            bevelThickness:0.05,
            bevelSize:0.03,
            bevelOffset:0,
            bevelSegments:5
        }
    )
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x -0.02) *0.5,
    //     - (textGeometry.boundingBox.max.y -0.02) *0.5,
    //     - (textGeometry.boundingBox.max.z -0.03) *0.5,
        
    // )
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial();
    textMaterial.matcap= matcapTexture
    // textMaterial.wireframe = true;
    // const textMaterial = new THREE.MeshNormalMaterial()
     neoText = new THREE.Mesh(textGeometry,textMaterial)
    // text.position.x = -1.5;
    scene.add(neoText)
    
    // random materials in the scene
    const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
    const donutMaterial = new THREE.MeshMatcapMaterial()
    donutMaterial.matcap= matcapTexture;
    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry,donutMaterial)
        donut.position.x =(Math.random()- 0.5) *10;
        donut.position.y =(Math.random()- 0.5) *10;
        donut.position.z =(Math.random()- 0.5) *10;
        
        donut.rotation.x= Math.random()*Math.PI;
        donut.rotation.y= Math.random()*Math.PI;

        const scale = Math.random();
        donut.scale.set(scale,scale,scale);
        scene.add(donut)
    }
}
)
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 4
// camera.position.y = 4
camera.position.z = 8
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//render composer
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.6,
    0.1,
    0.5
)
composer.addPass(bloomPass);
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    //renderer.render(scene, camera)
    //going to render from the composer
    composer.render();
    //rotation
    if (neoText) {
        neoText.rotation.y = Math.sin(elapsedTime);
       }
      
      
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()