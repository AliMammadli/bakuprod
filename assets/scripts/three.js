import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'
import { GUI } from 'dat.gui'


var renderer, scene, gui, model
var camera, controls
var mouse = new THREE.Vector2(), INTERSECTED

const mount = document.querySelector('#three')


init()
onWindowResize()
animate()


function init() {
    // Renderer

    // gui = new GUI()

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xF4F7FF)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.8 // 1.2
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./node_modules/three/examples/js/libs/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('assets/model/scene.gltf', (gltf) => {
        model = gltf.scene
        scene.add(model)

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                if (child.material.map) child.material.map.anisotropy = 16
            }
        })

        renderer.render(scene, camera)
    })


    camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 1000)
    camera.position.set(-14, 9, 0)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = true
    controls.autoRotate = true
    controls.dampingFactor = 0.03
    controls.maxPolarAngle = 1.3
    controls.minPolarAngle = 0.4
    updateSceneSize()



    new RGBELoader().load('assets/model/env.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture
        scene.environment = envMap

        texture.dispose()
        pmremGenerator.dispose()
    })


    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()


    const dlight = new THREE.DirectionalLight(0xffeeb1, 1)
    dlight.position.set(3, 8, 3)
    dlight.castShadow = true
    dlight.shadow.bias = -0.0001

    dlight.shadow.camera.top = 9
    dlight.shadow.camera.bottom = -9
    dlight.shadow.camera.left = 9
    dlight.shadow.camera.right = -9

    scene.add(dlight)
    scene.add(dlight.target)


    window.addEventListener('resize', onWindowResize, false)
    mount.addEventListener('mousemove', onMouseMove, false)
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}


function updateSceneSize() {
        if (window.innerWidth <= 550) {
            controls.minDistance = 73
            controls.maxDistance = 80
        } else if (window.innerWidth > 550 && window.innerWidth <= 800) {
            controls.minDistance = 45
            controls.maxDistance = 50
        } else if (window.innerWidth > 800 && window.innerWidth <= 1050) {
            controls.minDistance = 32
            controls.maxDistance = 35
        } else if (window.innerWidth > 1050 && window.innerWidth <= 1400) {
            controls.minDistance = 25
            controls.maxDistance = 30
        } else {
            controls.minDistance = 22
            controls.maxDistance = 30
        }
    controls.update()
}


var MOUSE_MOVE_THRESHOLD = 100, lastMouseMoveTime = -1

function onMouseMove(event) {
    var now = +new Date
    if (now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD) return

    lastMouseMoveTime = now
    event.preventDefault()

    mouse.x = (event.offsetX / mount.clientWidth) * 2 - 1
    mouse.y = - (event.offsetY / mount.clientHeight) * 2 + 1

    trace()
}


var animatedMeshes = []

function trace() {
    var ray = new THREE.Raycaster()
    ray.setFromCamera(mouse, camera)
    var intersects = ray.intersectObjects(scene.children)

    if (intersects.length > 0) {
        if (intersects[0].object.parent.name != INTERSECTED?.name) {
            if (intersects[0].object.parent.name !== 'plate' && intersects[0].object.parent.name !== 'Scene') {

                if (INTERSECTED) gsap.to(INTERSECTED.position, { duration: 0.5, delay: 0.1, y: 0, onComplete: () => animatedMeshes = animatedMeshes.filter(e => e !== INTERSECTED.name) })
                INTERSECTED = intersects[0].object.parent
                if (!animatedMeshes.includes(INTERSECTED.name)) {
                    animatedMeshes.push(INTERSECTED.name)
                    gsap.to(INTERSECTED.position, { duration: 0.5, y: 2, onComplete: () => animatedMeshes = animatedMeshes.filter(e => e !== INTERSECTED.name) })
                }

            } else {
                animatedMeshes = []
            }
        }
    } else {
        if (INTERSECTED) gsap.to(INTERSECTED.position, { duration: 0.5, delay: 0.1, y: 0 })
        INTERSECTED = null
        animatedMeshes = []
    }
}


function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}