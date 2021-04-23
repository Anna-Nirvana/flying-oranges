import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Material } from 'three'
import ThreeGlobe from 'three-globe';

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('./textures/EarthNormal.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
//add veggies here?

// Materials
const material = new THREE.MeshStandardMaterial()
    material.metalness = 0.7
    material.roughness = 0.9
    // material.flatShading = true;
    // material.vertexColors = true;
    material.normalMap = normalTexture;

material.color = new THREE.Color(0x2D80F1)

//Placeholder data
const N = 10;

const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
}));

//Globe
const sphere = new ThreeGlobe()
    .globeImageUrl('//img/1_earth_16k.jpeg')
    .bumpImageUrl('./textures/EarthNormal.png')
    // .globeMaterial(material)
    .arcsData(arcsData)
    .arcColor('color')
    .arcDashLength(0.4)
    .arcDashGap(4)
    .arcDashInitialGap(() => Math.random() * 5)
    .arcDashAnimateTime(1000);

scene.add(sphere);

// Lights

    scene.add(new THREE.AmbientLight(0xbbbbbb));
    scene.add(new THREE.DirectionalLight(0xffffff, 2));

    // Green
    const light1 = new THREE.AmbientLight(0xFFFFFF, 0.1)
        light1.position.x = 2
        light1.position.y = 3
        light1.position.z = 4

        scene.add(light1)



/**
 * Sizes
 */
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update size
    size.width = window.innerWidth
    size.height = window.innerHeight

    // Update camera
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // makes background transparent
})
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

//add interactivity based on mouse position
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowX) //clientX means X position of mouse
    mouseY = (event.clientY - windowY)
}
function updateSphere(event) {
    sphere.position.y = window.scrollY * 0.001
    }

window.addEventListener('scroll', updateSphere);


const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime //general starting rotation

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()