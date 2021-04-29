import './style.css'
// import * as testImage from './blowup.png'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import ThreeGlobe from 'three-globe';
import { Texture } from 'three';


// Debug
// const gui = new dat.GUI()

// Canvas
const importGlobeCanvas = document.querySelector('#importGlobe.webgl')

// Loading
const textureLoader = new THREE.TextureLoader()
// const normalTexture = textureLoader.load('//static/EarthSpec.png')

// Scene
const scene = new THREE.Scene()


// Data
const colorByProduct = {
  Almonds: '#A3320B', //brown
  Feed_Fodder: '#79745C', // yellow
  Fresh_Fruit: '#FF3E41', // orange X
  Fresh_Frozen_Fruit: '#FF3E41', // same X
  Fresh_Vegetables: '#596f62', //green X
  Misc_Food_Prep: '#1C3144', // any (Prussian blue)X
  Red_Meat: '#96150c', // red
  Vegetable_Oil: '#E8DDB5', // light green X
  Wine: '#520001' // dark red X
}

const latLong = {

  Argentina: {
    lat: -38.4161,
    long: -63.6167
  },

  Australia: {
    lat: -25.2744,
    long: -133.7751
  },

  California: {
    lat: 36.7783,
    long: -119.4179,
  },

  Canada: {
    lat: 56.1304,
    long: -106.3468,
  },

  Chile: {
    lat: -35.6751,
    long: -71.5430,
  },

  China: {
    lat: 35.8617,
    long: 104.1954
  },

  Costa_Rica: {
    lat: 9.7489,
    long: -83.7534
  },

  Denmark: {
    lat: 56.2639,
    long: 9.5018
  },

  Ecuador: {
    lat: -1.8312,
    long: -78.1834
  },

  // Kremnica
  // https://en.wikipedia.org/wiki/Geographical_midpoint_of_Europe#Current_claimants
  EU: {
    lat: 48.7030,
    long: 18.9176
  },

  Japan: {
    lat: 36.2048,
    long: 138.2529
  },

  India: {
    lat: 20.5937,
    long: 78.9629
  },

  Indonesia: {
    lat: 0.7893,
    long: 113.9213
  },

  Mexico: {
    lat: 23.6345,
    long: -102.5528
  },

  New_Zealand: {
    lat: -40.9006,
    long: 174.8860
  },

  Peru: {
    lat: -9.1900,
    long: -75.0152
  },

  Philippines: {
    lat: 12.8797,
    long: 121.7740
  },

  S_Korea: {
    lat: 35.9078,
    long: 127.7669
  },

  Taiwan: {
    lat: 23.6978,
    long: 120.9605
  },

  UAE: {
    lat: 23.4241,
    long: 53.8478
  },

  UK: {
    lat: 55.3781,
    long: -3.4360
  }

}

const exportData = {

  Almonds: {
    Canada: 199209810,
    India: 766845343,
    Japan: 269625440,
    UAE: 256403587,
    S_Korea: 170631823,
  },

  Feed_Fodder: {
    Canada: 68973327,
    China: 242075845,
    Japan: 242104978,
    Taiwan: 69815649,
    S_Korea: 100546493
  },

  Fresh_Fruit: {
    Canada: 915609574,
    Japan: 126346797,
    Mexico: 236331506,
    Taiwan: 92545819,
    S_Korea: 138300252,
  },

  Misc_Food_Prep: {
    Canada: 113405798,
    China: 158904684,
    Japan: 119465874,
    Mexico: 153255251,
    S_Korea: 309897178
  },

  Wine: {
    Canada: 199209810,
    China: 33501985,
    Denmark: 34194679,
    Japan: 78125056,
    UK: 220933143,
  },

}

const importData = {

  Fresh_Vegetables: {
    Canada: 130149073,
    China: 43377031,
    Mexico: 1855781508,
    Peru: 45908127,
    EU: 29025417,
  },

  Fresh_Frozen_Fruit: {
    Chile: 748132585,
    Costa_Rica: 167168287,
    Ecuador: 226152382,
    Mexico: 3662127500,
    Peru: 523428728,
  },

  Red_Meat: {
    Australia: 727321772,
    Canada: 1210380129,
    China: 682044881,
    Mexico: 2183330005,
    EU: 1715259347
  },

  Wine: {
    Argentina: 44473788,
    Australia: 89510287,
    Chile: 100642562,
    New_Zealand: 228965058,
    EU: 813974063
  },

  Vegetable_Oil: {
    Canada: 171157471,
    Indonesia: 189262281,
    Mexico: 192267321,
    Philippines: 115946271,
    EU: 224183253,
  }


}

/**
 * Converts a raw product value to a stroke width
 * @param {the raw product value} value 
 */
function getStrokeWidth(value) {
  // normalize value to range 0:1 based on expected min/max
  const minExpectedValue = 0;
  const maxExpectedValue = 2500000000; //+evench compute from data

  let normValue = Math.max(0, (value - minExpectedValue) / (maxExpectedValue - minExpectedValue));
  // convert normalized value to desired stroke range min/max
  const strokeMin = 1; //+evench make tunable
  const strokeMax = 10;
  return strokeMin + normValue * (strokeMax - strokeMin);
}

//Shake up the country centroid points a bit to distinguish 'em
const perturbationLong = 1.0;

//Structure export data for the globe arcs
let arcsData = [];
for (const [product, countriesByProduct] of Object.entries(exportData)) {
  for (const [country, value] of Object.entries(countriesByProduct)) {
    arcsData.push({
      startLat: latLong.California.lat,
      startLng: latLong.California.long,
      endLat: latLong[country].lat, //dig into latLong map/dict/object, match country string
      endLng: latLong[country].long + (2 * Math.random() - 1.0) * perturbationLong,
      color: colorByProduct[product],
      strokeWidth: getStrokeWidth(value)
    });
  }
}

for (const [product, countriesByProduct] of Object.entries(importData)) {
  for (const [country, value] of Object.entries(countriesByProduct)) {
    arcsData.push({
      startLat: latLong[country].lat, //dig into latLong map/dict/object, match country string
      startLng: latLong[country].long + (2 * Math.random() - 1.0) * perturbationLong,
      endLat: latLong.California.lat,
      endLng: latLong.California.long,
      color: colorByProduct[product],
      strokeWidth: getStrokeWidth(value)
    });
  }
}
console.log(arcsData);

var importKeyImgURL = 'import_key.png';
var exportKeyImgURL = 'export_key.png';
var importTitleImgURL = 'import_title.png';
var exportTitleImgURL = 'export_title.png';

var image1 = new Image();
image1.src = importKeyImgURL;
document.getElementById('import').appendChild(image1);

var image2 = new Image();
image2.src = exportKeyImgURL;
document.getElementById('export').appendChild(image2);

var image3 = new Image();
image3.src = importTitleImgURL;
document.getElementById('importButton').appendChild(image3);

var image4 = new Image();
image4.src = exportTitleImgURL;
document.getElementById('exportButton').appendChild(image4);


// leftKeyImg.attr('opacity', '1');
// .attr('background', 'rgba(0, 0, 0, 0)');


// Objects
//const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const globe = new ThreeGlobe()
  // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .globeImageUrl('earth-night-1.png')
  // .globeImageUrl(testImage)
  .showGlobe(true)
  .arcsData(arcsData)
  .arcColor('color')
  .arcDashLength(0.4)
  .arcDashGap(2)
  .arcStroke('strokeWidth')
  .arcDashInitialGap(() => Math.random() * 5)
  .arcDashAnimateTime(1000);

scene.add(globe);

function showImports() {
  console.log('GREETINGS');

  //note starting state + increment

  //create arcsData anew

  //clear the old arcs out
  
  //add new arcsData to globe
}

  //function call .on button click 
  document.getElementById('importButton')
  .addEventListener('click', showImports)


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

window.addEventListener('resize', () => {
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
camera.position.z = 200;
camera.position.y = 300;

//Controls
const controls = new OrbitControls(camera, importGlobeCanvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: importGlobeCanvas,
  alpha: true
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
  globe.position.y = window.scrollY * 0.001
}

window.addEventListener('scroll', updateSphere);

const clock = new THREE.Clock()

const tick = () => {

  targetX = mouseX * 0.001
  targetY = mouseY * 0.001

  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // globe.rotation.y = .5 * elapsedTime //general starting rotation

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