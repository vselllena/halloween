import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'



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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

// Instantiate a loader
const loader = new GLTFLoader();


// Load a glTF resource
loader.load(
	// resource URL
	'fox.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );
        scene.position.set(1, 1, 1);

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

        console.log("model loaded")

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

//model end

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        fontLoader.load(
            '/fonts/helvetiker_regular.typeface.json',
            (font) =>
            {
                // Material
                const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

                // Text
                const textGeometry = new THREE.TextBufferGeometry(
                    'Happy Halloween\nSellercloud',
                    {
                        font: font,
                        size: 0.3,
                        height: 0.2,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 5
                    }
                )
                textGeometry.center()

                const text = new THREE.Mesh(textGeometry, material)
                scene.add(text)

                // Donuts
                const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64)



                for(let i = 0; i < 200; i++)
                {
                    const donut = new THREE.Mesh(donutGeometry, material)
                    donut.position.x = (Math.random() - 0.5) * 10
                    donut.position.y = (Math.random() - 0.5) * 10
                    donut.position.z = (Math.random() - 0.5) * 10
                    donut.rotation.x = Math.random() * Math.PI
                    donut.rotation.y = Math.random() * Math.PI
                    const scale = Math.random()
                    donut.scale.set(scale, scale, scale)

                    scene.add(donut)

                }


                
                
                // const gltfLoader = new GLTFLoader();
                // gltfLoader.load('./models/shiba/scene.gltf', (gltfScene) => {

                //     scene.add(gltfScene.scene);
                // });
            }
        )
    }
)

// //debug
// gui.add(mesh.position, 'y')


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



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()