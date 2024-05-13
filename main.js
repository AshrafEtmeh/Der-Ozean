import gsap from 'gsap'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


const gui = new dat.GUI()
const world = {
  plane: {
    width: 19,
    height: 19,
    widthSegments: 17,
    heightSegments: 17
  }
}
function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  const {array} = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]

    array[i+2] = z + Math.random()*0.5
  }

  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,0.19,0.4)
  }
  planeMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3))
}
gui.add(world.plane, 'width',1,20).onChange(generatePlane)
gui.add(world.plane, 'height',1,20).onChange(generatePlane)
gui.add(world.plane, 'widthSegments',0,40).onChange(generatePlane)
gui.add(world.plane, 'heightSegments',0,40).onChange(generatePlane)


const scene = new THREE.Scene()

const raycaster = new THREE.Raycaster()

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth/innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth,innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

const plane = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})



const planeMesh = new THREE.Mesh(plane,planeMaterial)
camera.position.z = 5

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0,0,1)
scene.add(light)
scene.add(camera)
scene.add(planeMesh)

const mouse = {
  x: undefined,
  y: undefined
}


// vertice position randomization
const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i += 3) {
  const x = array[i]
  const y = array[i+1]
  const z = array[i+2]

  array[i+2] = z + Math.random()*0.5
}

// color attribute addition
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0,0.19,0.4)
}

planeMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3))
console.log(colors)
new OrbitControls(camera,renderer.domElement)
function animate () {
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    // console.log(intersects[0].face)
    const {color} = intersects[0].object.geometry.attributes
    //vertice 1
    color.setX(intersects[0].face.a,0.1)
    color.setY(intersects[0].face.a,0.5)
    color.setZ(intersects[0].face.a,1)
    //vertice 2
    color.setX(intersects[0].face.b,0.1)
    color.setY(intersects[0].face.b,0.5)
    color.setZ(intersects[0].face.c,1)
    //vertice 3
    color.setX(intersects[0].face.c,0.1)
    color.setY(intersects[0].face.c,0.5)
    color.setZ(intersects[0].face.c,1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        //vertice 1
        color.setX(intersects[0].face.a,hoverColor.r)
        color.setY(intersects[0].face.a,hoverColor.g)
        color.setZ(intersects[0].face.a,hoverColor.b)
        //vertice 2
        color.setX(intersects[0].face.b,hoverColor.r)
        color.setY(intersects[0].face.b,hoverColor.g)
        color.setZ(intersects[0].face.c,hoverColor.b)
        //vertice 3
        color.setX(intersects[0].face.c,hoverColor.r)
        color.setY(intersects[0].face.c,hoverColor.g)
        color.setZ(intersects[0].face.c,hoverColor.b)
      }
    })
  }
}
animate()


addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth)*2-1
  mouse.y = -(event.clientY / innerHeight)*2+1
  // console.log(mouse)
})







// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))
