import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#fff', 0.5)

const light = new THREE.PointLight('#fff', 0.5)
light.position.set(2, 3, 4)

scene.add(ambientLight, light)

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()
// const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/2/px.jpg',
  '/textures/environmentMaps/2/nx.jpg',
  '/textures/environmentMaps/2/py.jpg',
  '/textures/environmentMaps/2/ny.jpg',
  '/textures/environmentMaps/2/pz.jpg',
  '/textures/environmentMaps/2/nz.jpg'
])

/**
 * Objects
 */
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0
material.envMap = environmentMapTexture

gui.add(material, 'metalness').min(0).max(1).step(0.01)
gui.add(material, 'roughness').min(0).max(1).step(0.01)

const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
const tori = Array(100)
  .fill(undefined)
  .map(() => {
    const torus = new THREE.Mesh(torusGeometry, material)

    torus.position.x = (Math.random() - 0.5) * 10
    torus.position.y = (Math.random() - 0.5) * 10
    torus.position.z = (Math.random() - 0.5) * 10

    torus.rotation.x = Math.random() * Math.PI
    torus.rotation.y = Math.random() * Math.PI

    torus.scale.x = torus.scale.y = torus.scale.z = Math.random()

    scene.add(torus)

    return {
      torus,
      rotationX: (Math.random() - 0.5) * 2,
      rotationY: (Math.random() - 0.5) * 2
    }
  })

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello Three.js', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  })
  // textGeometry.computeBoundingBox()
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // )
  // console.log(textGeometry.boundingBox)
  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})

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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  tori.forEach((t) => {
    t.torus.rotation.x = t.rotationX * elapsedTime
    t.torus.rotation.y = t.rotationY * elapsedTime
  })

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
