// Create the main scene
const scene = new THREE.Scene();

// Set up the camera with a perspective view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer and set its size
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer to the DOM (in the scene-container div)
document.getElementById('scene-container').appendChild(renderer.domElement);

// Create a cube geometry and its material (red)
const geometry1 = new THREE.BoxGeometry();
const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry1, material1);
cube.position.x = -2; // Position the cube to the left
scene.add(cube); // Add the cube to the scene

// Create a sphere geometry and its material (green)
const geometry2 = new THREE.SphereGeometry();
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry2, material2);
scene.add(sphere); // Add the sphere to the scene

// Create a cone geometry and its material (blue)
const geometry3 = new THREE.ConeGeometry();
const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cone = new THREE.Mesh(geometry3, material3);
cone.position.x = 2; // Position the cone to the right
scene.add(cone); // Add the cone to the scene

// Set the camera position
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 5;

// Define the animate function
function animate() {
    requestAnimationFrame(animate);

    // Bouncing logic: Adjust the y-position of each object using a sine function
    cube.position.y = Math.abs(Math.sin(Date.now() * 0.001)) * 2;  // Bounce the cube
    sphere.position.y = Math.abs(Math.sin(Date.now() * 0.001 + 1)) * 2;  // Bounce the sphere
    cone.position.y = Math.abs(Math.sin(Date.now() * 0.001 + 2)) * 2;  // Bounce the cone

    // Render the scene with the camera
    renderer.render(scene, camera);
}

// Call the animate function to start the animation loop
animate();
