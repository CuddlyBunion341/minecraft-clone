import { ArrowHelper } from "three";
import { BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector2, Vector3, WebGLRenderer } from "three";
import Stats from "../node_modules/stats.js/src/Stats.js";
import { createSteveControls } from "./controls.js";
import { createGUI } from "./gui.js";
import { camera, scene } from "./scene.js";
// import {camera, scene} from "../experiments/vertexcolors.js";
import World from "./world.js";

const canvas = document.querySelector("canvas#c");
const renderer = new WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const renderDistance = 5;

const world = new World(scene, renderDistance);

const raycaster = new Raycaster();
raycaster.far = 15;

const outline = new Mesh(
	new BoxGeometry(1.0001, 1.0001, 1.0001),
	new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false })
);
outline.position.y = 60;
outline.visible = false;
scene.add(outline);

const gui = createGUI();

const placeBlock = () => {
	const block = gui.selectedBlock;
	const pos = castRay(false);
	if (pos) world.placeBlock(...pos, block);
};

const removeBlock = () => {
	const pos = castRay(true);
	if (pos) world.removeBlock(...pos);
};

const moveOutline = (x, y, z) => {
	outline.position.fromArray([x, y, z]).addScalar(0.5);
	outline.visible = true;
};

const castRay = (inside = true, moveBox = false) => {
	raycaster.setFromCamera(new Vector2(0, 0), camera);

	// const camPos = camera.position.clone().floor();
	// if (world.getBlock(camPos.x, camPos.y, camPos.z) && !moveBox) return [camPos.x, camPos.y, camPos.z];

	const intersect = raycaster.intersectObjects(world.worldGroup.children)[0];
	if (intersect) {
		if (!intersect.face) return;
		const norm = intersect.face.normal.divideScalar(2).multiplyScalar(inside ? -1 : 1);
		const pos = [];
		const intersectVector = new Vector3().copy(intersect.point).add(norm).floor();
		intersectVector.toArray(pos);

		return pos;
	}
};

const controls = createSteveControls(
	camera,
	canvas,
	scene,
	world,
	() => placeBlock("dirt"),
	removeBlock,
	newChunk => setTimeout(() => world.render(newChunk.x, newChunk.y, renderDistance), 0)
);

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const render = () => {
	// controls.update(clock.getDelta());
	const rayPos = castRay(true, true);
	if (rayPos) moveOutline(...rayPos);
	else outline.visible = false;
	controls.update();
	// castRay(true);
	stats.begin();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(render);
};
render();
