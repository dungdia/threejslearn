import * as three from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const modelUrl = new URL("./model/3ddd.glb", import.meta.url);

//set up render and camera
const renderer = new three.WebGLRenderer();
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);

camera.position.set(0, 150, 260);

//control and grid helper
const gridHelper = new three.GridHelper(10000, 1000);
scene.add(gridHelper);
// const color = 0xffffff;
// const intensity = 3;
// const light = new three.DirectionalLight(color, intensity);
// light.position.set(-1, 2, 4);
const ambientLight = new three.AmbientLight(0xffffff, 3); // soft white light
scene.add(ambientLight);

// scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);

let church;
let isLoaded = false;

loader.load(
  modelUrl,
  (gltf) => {
    church = gltf.scene;
    console.log(church);

    scene.add(church);
    // isLoaded = true;
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

let up = true;

//animation loop
function animate() {
  requestAnimationFrame(animate);

  if (isLoaded) church.rotation.y += 0.01;

  if (isLoaded && church.position.y >= 50) up = false;
  if (isLoaded && church.position.y <= 0) up = true;

  if (isLoaded && up) church.position.y += 0.5;
  if (isLoaded && !up) church.position.y -= 0.5;

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}

animate();
