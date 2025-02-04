import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById("scene-container").appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 100;
controls.minDistance = 3;

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 3, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Add subtle directional light for better planet illumination
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, // strength
  0.4, // radius
  0.85 // threshold
);
composer.addPass(bloomPass);

// Create sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00,
  emissive: 0xffaa00,
  emissiveIntensity: 2,
  metalness: 0.1,
  roughness: 0.3,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets
function createPlanet(radius, color, orbitRadius, speed) {
  const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.4,
    envMapIntensity: 1.0,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  // Create orbit
  const orbitGeometry = new THREE.RingGeometry(
    orbitRadius - 0.1,
    orbitRadius + 0.1,
    64
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  return {
    mesh: planet,
    orbitRadius: orbitRadius,
    speed: speed,
    angle: Math.random() * Math.PI * 2,
  };
}

// Create environment map for reflections
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

const planets = [
  createPlanet(0.4, 0x3366ff, 5, 0.02), // Blue planet
  createPlanet(0.6, 0xff6633, 8, 0.015), // Orange planet
  createPlanet(0.3, 0x66ff33, 11, 0.01), // Green planet
  createPlanet(0.7, 0xff3366, 15, 0.008), // Red planet
];

planets.forEach((planet) => scene.add(planet.mesh));

// Create star field
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
  });

  const starsVertices = [];
  for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starsVertices, 3)
  );
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}

createStars();

// Camera position
camera.position.z = 20;

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate sun
  sun.rotation.y += 0.005;

  // Update planet positions
  planets.forEach((planet) => {
    planet.angle += planet.speed;
    planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
    planet.mesh.rotation.y += 0.02;
  });

  // Update controls
  controls.update();

  // Render scene with post-processing
  composer.render();
}

animate();
