import {
	AmbientLight,
	AxesHelper,
	Color,
	DirectionalLight, Fog, Mesh, MeshBasicMaterial, NearestFilter, PerspectiveCamera, PlaneGeometry, Scene
} from "three";
import { loadImage } from "./loader.js";
import { createEnvironment } from "./environment.js";

const scene = new Scene();
scene.background = new Color(0x86b9e3);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const axis = new AxesHelper();
camera.position.set(20, 60, 20);
scene.add(camera);
scene.add(axis);

scene.fog = new Fog(0xffffff, 10, 600);

// reticle
// const reticleMesh = new Mesh(new RingBufferGeometry(1,3),new MeshBasicMaterial({color: 0x00FF00}));
// camera.add(reticleMesh)

loadImage("gui/croshair.png", img => {
	img.magFilter = NearestFilter;
	const plane = new PlaneGeometry(0.025, 0.025);
	const mat = new MeshBasicMaterial({ map: img, depthTest: false, depthWrite: false, transparent: true });
	const croshair = new Mesh(plane, mat);
	croshair.renderOrder = 999;
	croshair.position.z -= 0.5;
	camera.add(croshair);
});

const setShadowSize = (light, sz, mapSz) => {
	light.shadow.camera.left = sz;
	light.shadow.camera.bottom = sz;
	light.shadow.camera.right = -sz;
	light.shadow.camera.top = -sz;
	if (mapSz) {
		light.shadow.mapSize.set(mapSz, mapSz);
	}
};

const addLight = (x, y, z) => {
	const color = 0xffffff;
	const intensity = 0.8;
	const light = new DirectionalLight(color, intensity);
	light.position.set(x, y, z);
	light.updateWorldMatrix();
	light.castShadow = true;
	light.position.multiplyScalar(50);
	setShadowSize(light, 128, 102400000000);
	/* This is adding a helper to the scene that will help us visualize the direction of the light. */
	// scene.add(new CameraHelper(light.shadow.camera));
	scene.add(light);
	/* This is adding a helper to the scene that will help us visualize the direction of the light. */
	// scene.add(new DirectionalLightHelper(light));
};
// addLight(-5, 3.25, 5);

const ambient = new AmbientLight(0xffffff, 0.1);
scene.add(ambient);

createEnvironment(scene);

// const hemi = new HemisphereLight();
// hemi.position.set( 0, 500, 0 );
// scene.add(hemi);

// add meshes
// const geometry = new BoxGeometry(1, 1, 1);
// const material = new MeshNormalMaterial();
// const mesh = new Mesh(geometry, material);
// mesh.position.set(0, 70, 0);
// mesh.castShadow = true;
// scene.add(mesh);

// updateChunks();

export { scene, camera };
