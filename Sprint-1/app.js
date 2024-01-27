const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const geometry1 = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry1, material1);
cube.position.x = -2;
scene.add(cube);

const geometry2 = new THREE.SphereGeometry();
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry2, material2);
scene.add(sphere);

const geometry3 = new THREE.ConeGeometry();
const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cone = new THREE.Mesh(geometry3, material3);
cone.position.x = 2;
scene.add(cone);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 8;

function animate() {
    requestAnimationFrame(animate);

    // Bouncing logic
    cube.position.y = Math.abs(Math.sin(Date.now() * 0.001)) * 2;
    sphere.position.y = Math.abs(Math.sin(Date.now() * 0.001 + 1)) * 2;
    cone.position.y = Math.abs(Math.sin(Date.now() * 0.001 + 2)) * 2;

    renderer.render(scene, camera);
}

animate();
