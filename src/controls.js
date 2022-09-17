import { Mesh } from "three";
import { MeshBasicMaterial } from "three";
import { Raycaster } from "three";
import { Ray } from "three";
import { BoxGeometry } from "three";
import { Vector3, Vector2, ArrowHelper } from "three";
import { PointerLockControls } from "../node_modules/three/examples/jsm/controls/PointerLockControls.js";
// not my code: https://codepen.io/Gowther/pen/voWgvN

export const createSteveControls = (
	camera,
	canvas,
	scene,
	world,
	place = () => {},
	remove = () => {},
	onChunkChange = (pos) => {}
) => {
	const controls = new PointerLockControls(camera, canvas);
	canvas.addEventListener("click", () => controls.lock());

	const velocity = new Vector3();
	const chunkPos = new Vector2();
	const pressedKeys = {};

	let canJump = false;
	let jumping = false;

	let prevTime = performance.now();

	document.addEventListener("keydown", (e) => {
		pressedKeys[e.code] = true;
	});

	document.addEventListener("keyup", (e) => {
		pressedKeys[e.code] = false;
	});

	document.addEventListener("mousedown", (e) => {
		if (e.which == 3) place();
		if (e.which == 1) remove();
	});

	const playerBox = new Mesh(
		new BoxGeometry(0.5, 2, 0.5, 1, 2, 1),
		new MeshBasicMaterial({ wireframe: true })
	);
	// scene.add(playerBox);

	const update1 = () => {
		const time = performance.now();
		const delta = (time - prevTime) / 1000;
		prevTime = time;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.y -= velocity.y * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		const speed = pressedKeys["AltLeft"] ? 1000.0 : 200.0;

		if (pressedKeys["KeyW"]) velocity.z -= speed * delta;
		if (pressedKeys["KeyS"]) velocity.z += speed * delta;
		if (pressedKeys["KeyA"]) velocity.x -= speed * delta;
		if (pressedKeys["KeyD"]) velocity.x += speed * delta;
		if (pressedKeys["Space"]) {
			// if (canJump) velocity.y += 50;
			// canJump = false;
			velocity.y += speed * delta;
		}
		if (pressedKeys["ShiftLeft"]) velocity.y -= speed * delta;
		if (pressedKeys["KeyC"]) place();
		if (pressedKeys["KeyV"]) remove();

		// velocity.y -= 9.87 * delta * 10;

		const getCameraPos = () => {
			const x = Math.floor(controls.getObject().position.x);
			const y = Math.floor(controls.getObject().position.y);
			const z = Math.floor(controls.getObject().position.z);

			return [x, y, z];
		};

		const canMoveDown = () => {
			const [x, y, z] = getCameraPos();

			const block = world.getBlock(x, y - 2, z);
			if (!block) canJump = true;
			return !block;
		};

		const canMoveUp = () => {
			const [x, y, z] = getCameraPos();

			const block = world.getBlock(x, y + 1, z);
			return !block;
		};

		const canMove = (dx, dy, dz) => {
			const x = Math.floor(controls.getObject().position.x);
			const y = Math.floor(controls.getObject().position.y);
			const z = Math.floor(controls.getObject().position.z);

			if (dy) return !(world.getBlock(x, y - 2), z && velocity.y < 0);

			const block1 = world.getBlock(x + dx, y, z + dz);
			const block2 = world.getBlock(x + dx, y + 1, z + dz);
		};

		const collides = () => {
			const [x, y, z] = getCameraPos();
			// const vector = new Vector3();
			// const direction = camera.getWorldDirection(vector);
			// console.log(vector);

			const block1 = world.getBlock(x, y, z);
			const block2 = world.getBlock(x, y - 1, z);

			return !!block1 || !!block2;
		};

		const height = controls.getObject().position.y;

		const direction = new Vector3();
		camera.getWorldDirection(direction);

		const collidesN = () => {
			return false;
			// https://stackoverflow.com/questions/11473755/how-to-detect-collision-in-three-js
			for (
				let vertexIndex = 0;
				vertexIndex <
				playerBox.geometry.attributes.position.array.length;
				vertexIndex++
			) {
				const localVertex = new Vector3()
					.fromBufferAttribute(
						playerBox.geometry.attributes.position,
						vertexIndex
					)
					.clone();
				const globalVertex = localVertex.applyMatrix4(playerBox.matrix);
				const directionVector = globalVertex.sub(playerBox.position);

				const ray = new Raycaster(
					playerBox.position,
					directionVector.clone().normalize()
				);
				const collisionResults = ray.intersectObjects(
					world.worldGroup.children
				);
				if (
					collisionResults.length > 0 &&
					collisionResults[0].distance < directionVector.length()
				) {
					controls
						.getObject()
						.position.sub(directionVector.multiply(0.5));
					return true;
					// a collision occurred... do something...
				}
			}
		};

		// controls.getObject().translateX(velocity.x * delta);
		// if (collides()) controls.getObject().translateX(-velocity.x * delta);
		// controls.getObject().translateZ(velocity.z * delta);
		// if (collides()) controls.getObject().translateZ(-velocity.z * delta);

		// controls.getObject().position.y = height + (canMoveDown() ? velocity.y * delta : 0);

		// controls.getObject().position.y = canMoveDown() ? height + velocity.y * delta : height;

		// controls.getObject().translateX(direction.x);
		// controls.getObject().position.z = direction.z;
		// controls.getObject().position.z += direction.z;
		// controls.getObject().position.add(direction.multiply(new Vector3(1,0,1)));

		// if (direction.y >= 0.6 || direction.y <= -0.6) controls.getObject().translateZ(1);

		if (velocity.y < 0) {
			// moving down
			if (canMoveDown())
				controls.getObject().position.y = height + velocity.y * delta;
			else controls.getObject().position.y = height;
		} else controls.getObject().position.y = height + velocity.y * delta;

		// console.log('/////////////////');
		// console.log('direction',direction.multiplyScalar(100).floor());
		// console.log('position.',camera.position.clone().multiplyScalar(100).floor());
		// console.log('newpos...',camera.position.clone().add(direction).multiplyScalar(100).floor());

		// console.log(velocity);

		/* It's adding a constant offset to the camera position. */
		playerBox.position.copy(
			camera.position.clone().add(new Vector3(0, -0.7, 0))
		);

		// if (!!velocity.y) controls.getObject().position.y = canMoveUp() ? height + velocity.y * delta : height;
		// if (!velocity.y) controls.getObject().position.y = canMoveDown() ? height + velocity.y * delta : height;

		const newChunkPos = new Vector2(
			Math.floor(camera.position.x / 16),
			Math.floor(camera.position.z / 16)
		);

		if (!(newChunkPos.x == chunkPos.x && newChunkPos.y == chunkPos.y))
			onChunkChange(chunkPos, newChunkPos);
		chunkPos.copy(newChunkPos);
	};

	const update = () => {
		const time = performance.now();
		const delta = (time - prevTime) / 1000;
		prevTime = time;

		const v = new Vector3(0, 0, 0);

		if (pressedKeys["KeyW"]) v.x += 10 * delta;
		if (pressedKeys["KeyS"]) v.x -= 10 * delta;
		if (pressedKeys["KeyD"]) v.z += 10 * delta;
		if (pressedKeys["KeyA"]) v.z -= 10 * delta;
		if (pressedKeys["Space"]) v.y += 10 * delta;
		if (pressedKeys["ShiftLeft"]) v.y -= 10 * delta;

		const x = controls.getObject().position.x;
		const y = controls.getObject().position.y;
		const z = controls.getObject().position.z;

		// if (world.getBlock(x + v.x, y, z)) v.x *= -1;
		controls.moveForward(v.x);
		controls.moveRight(v.z);
		controls.getObject().position.y += v.y;
	};

	return {
		update,
	};
};
