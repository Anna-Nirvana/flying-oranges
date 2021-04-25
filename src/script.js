import './style.css'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import ThreeGlobe from 'three-globe';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

 // Loading
 const textureLoader = new THREE.TextureLoader()
 //const normalTexture = textureLoader.load('//static/EarthSpec.png')

// Scene
const scene = new THREE.Scene()

// Materials

//const material = new THREE.MeshBasicMaterial()
//material.color = new THREE.Color(0xff0000)

// Mesh
//const sphere = new THREE.Mesh(geometry,material)
//scene.add(sphere)

//Data
const colorByProduct = {
    Almonds: '#B83C06',
    Wine: '#B83C06'
  }

  const latLong = {

    California: {
      lat: 36.7783,
      long: -106.3468,
    },
    
    Canada: {
      lat: 56.1304,
      long: -119.4179,
    }

  }

  const Sample = {

      Almonds: {
        Canada: 199209810,
        // "India":766845343,
        // "Japan": 269625440,
        // "UAE": 256403587,
        // "S. Korea": 170631823,
        },

      Wine: {
        Canada: 199209810,
        // "India":766845343,
        // "Japan": 269625440,
        // "UAE": 256403587,
        // "S. Korea": 170631823,
        },
      
      //add more produce!

  }

    // Placeholder data
    // const N = 20;

    // const arcsData = [...Array(N).keys()].map(() => ({
    //   startLat: (Math.random() - 0.5) * 180,
    //   startLng: (Math.random() - 0.5) * 360,
    //   endLat: (Math.random() - 0.5) * 180,
    //   endLng: (Math.random() - 0.5) * 360,
    //   color: ['#2274A5', '#B49082', '#98473E', '#A37C40'][Math.round(Math.random() * 3)]
    // }));

    let arcsData = [];

    for (const [product, countriesByProduct] of Object.entries(Sample))
    {
      for (const [country, value] of Object.entries(countriesByProduct))
      {
        arcsData.push({
          startLat: latLong.California.lat,
          startLng: latLong.California.long,
          endLat: latLong[country].lat,
          endLng: latLong[country].long,
          color: colorByProduct[product]
        });
      }
    }
    console.log(arcsData);

//Globe
// Objects
//const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')

    // .globeImageUrl('https://raw.githubusercontent.com/Anna-Nirvana/oranges-on-a-plane/master/static/textures/EarthSpec.png')
      // .bumpImageUrl('./static/textures/EarthNormal.png')
      // .globeMaterial(material)
    .arcsData(arcsData)
    .arcColor('color')
    .arcDashLength(0.4)
    .arcDashGap(4)
    // .arcStroke()
    .arcDashInitialGap(() => Math.random() * 5)
    .arcDashAnimateTime(1000);

    scene.add(globe);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));



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

 //Arcs cam
 const camera = new THREE.PerspectiveCamera();
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 camera.position.z = 500;

// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.x = 0
// camera.position.y = 0
// camera.position.z = 2
// scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
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
    mouseX = (event.clientX - windowX) //clientX means X latLong of mouse
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
    globe.rotation.y = .5 * elapsedTime //general starting rotation

    globe.rotation.y += .5 * (targetX - globe.rotation.y)
    globe.rotation.x += .05 * (targetY - globe.rotation.x)
    globe.position.z += -.05 * (targetY - globe.rotation.x)


    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()