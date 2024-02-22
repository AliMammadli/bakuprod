import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'


var renderer, scene, gui, model
var camera, controls
var mouse = new THREE.Vector2(), INTERSECTED
var MOUSE_MOVE_THRESHOLD = 100, lastMouseMoveTime = -1
var animatedMeshes = []

const mount = document.querySelector('#three')


init()
onWindowResize()
animate()


function init() {
    addScene()
    addLoader()
    addControls()
    addLights()
    addListeners()
}

function addScene() {
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
}

function addLoader() {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('assets/scripts/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('assets/model/scene.glb', (glb) => {
        model = glb.scene
        scene.add(model)

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                if (child.material.map) child.material.map.anisotropy = 16
            }
        })

        startAnimation()

        renderer.render(scene, camera)
    })
}

function startAnimation() {
    const delays = {
        'sushi_avocado_1_1': 0.1,
        'sushi_avocado_1_2': 0.1,
        'sushi_avocado_1_3': 0.1,
        'sushi_avocado_1_4': 0.2,
        'sushi_avocado_2_1': 0.3,
        'sushi_avocado_2_2': 0.3,
        'sushi_avocado_2_3': 0.3,
        'sushi_avocado_2_4': 0.4,
        'sushi_salmon_1_1': 0.5,
        'sushi_salmon_1_2': 0.5,
        'sushi_salmon_1_3': 0.5,
        'sushi_salmon_1_4': 0.6,
        'sushi_salmon_2_1': 0.7,
        'sushi_salmon_2_2': 0.7,
        'sushi_salmon_2_3': 0.7,
        'sushi_salmon_2_4': 0.8,
        'sushi_tuna_1_1': 0.9,
        'sushi_tuna_1_2': 0.9,
        'sushi_tuna_1_3': 0.9,
        'sushi_tuna_1_4': 1.0,
        'sushi_tuna_2_1': 1.1,
        'sushi_tuna_2_2': 1.1,
        'sushi_tuna_2_3': 1.1,
        'sushi_tuna_2_4': 1.2,
        'sake_1_2': 1.3,
        'sake_1_1': 1.4,
        'sake_2_2': 1.5,
        'sake_2_1': 1.6,
        'maguro_1_2': 1.7,
        'maguro_1_1': 1.8,
        'maguro_2_2': 1.9,
        'maguro_2_1': 2.0,
        'stick_holder': 2.1,
        'stick_left_1': 2.2,
        'stick_left_2': 2.2,
        'stick_right_1': 2.3,
        'stick_right_2': 2.3,
        'sauce_bowl_1': 2.4,
        'sauce_bowl_2': 2.4,
        'wasabi_bowl_1': 2.5,
        'wasabi_bowl_2': 2.5,
    }
    model.traverse((child) => {
        if (child.isMesh && child.parent.name !== 'plate') {
            gsap.fromTo(child.position, { y: 10 }, { duration: 2, delay: delays[child.name], y: 0 })
        }
    })
}

function addControls() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 1000)
    camera.position.set(-14, 9, 0)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableZoom = false
    controls.enableDamping = true
    controls.autoRotate = false
    controls.dampingFactor = 0.03
    controls.maxPolarAngle = 1.3
    controls.minPolarAngle = 0.4
    onWindowResize()
    updateSceneSize()

    setTimeout(() => controls.autoRotate = true, 4800)
}

function addLights() {
    // gui = new GUI()

    new RGBELoader().load('assets/model/env.hdr', (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture
        scene.environment = envMap

        texture.dispose()
        pmremGenerator.dispose()
    })

    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()


    const dlight = new THREE.DirectionalLight(0xffeeb1, 1)
    dlight.position.set(3, 8, 3).normalize()
    dlight.castShadow = true
    dlight.shadow.bias = -0.0001

    dlight.shadow.camera.top = 9
    dlight.shadow.camera.bottom = -9
    dlight.shadow.camera.left = 9
    dlight.shadow.camera.right = -9

    scene.add(dlight)
    scene.add(dlight.target)
}

function addListeners() {
    window.addEventListener('resize', onWindowResize, false)
    mount.addEventListener('mousemove', onMouseMove, false)

    mount.addEventListener('mousedown', () => mount.style.cursor = 'grabbing', false)
    mount.addEventListener('mouseup', () => mount.style.cursor = 'grab', false)
    mount.addEventListener('mouseenter', () => mount.style.cursor = 'grab', false)
    mount.addEventListener('mouseout', () => mount.style.cursor = 'pointer', false)
}

function onWindowResize() {
    if (window.innerWidth < 800) {
        camera.aspect = 1
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerWidth)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    } else {
        camera.aspect = 16 / 9
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerWidth * 9 / 16)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
}

function updateSceneSize() {
    if (window.innerWidth <= 550) {
        controls.minDistance = 24
        controls.maxDistance = 30
    } else {
        controls.minDistance = 22
        controls.maxDistance = 30
    }
    controls.update()
}

function onMouseMove(event) {
    var now = +new Date
    if (now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD) return

    lastMouseMoveTime = now
    event.preventDefault()

    mouse.x = (event.offsetX / mount.clientWidth) * 2 - 1
    mouse.y = - (event.offsetY / mount.clientHeight) * 2 + 1

    trace()
}

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