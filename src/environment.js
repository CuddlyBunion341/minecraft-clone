import { MeshBasicMaterial } from "three";
import { Mesh } from "three";
import { BoxGeometry } from "three";
import { NearestFilter } from "three";
import { CubeTextureLoader } from "three";
import { BufferGeometry } from "three";
import { createMatrix2d, inRange } from "../lib/mathlib.js";
import noise from "../lib/perlin.js";
import { loadTextures } from "./loader.js";

export const createEnvironment = scene => {
	const init = () => {
		// createClouds();
		createSkybox();
	};

	const createSkybox = () => {
		const loader = new CubeTextureLoader();
		const textures = loader.load([
			'images/environment/skybox-sun.png',
			'images/environment/skybox-side.png',
			'images/environment/skybox-top.png',
			'images/environment/skybox-bottom.png',
			'images/environment/skybox-side.png',
			'images/environment/skybox-side.png',
		]);
		// scene.background = textures;
	};

	const createClouds = () => {
		const clouds = new BufferGeometry();
		const cloudMaterial = new MeshBasicMaterial();
		const map = createCloudMap(100, 100);
		const geometry = new BoxGeometry(20, 2, 10);

		for (let i = 0; i < 100; i++) {
			for (let j = 0; j < 100; j++) {
				if (!map[i][j]) continue;
				const cloud = new Mesh(geometry, cloudMaterial);
				cloud.position.set(i * 5, 160, j * 10);
				scene.add(cloud);
			}
		}
	};

	init();
};

const createCloudMap = (width, height) => {
	const matrix = createMatrix2d(width, height);
	for (let w = 0; w < width; w++) {
		for (let h = 0; h < height; h++) {
			// const divisor = 100;
			// const val = noise.simplex2((w + 0) / divisor, (h + 0) / divisor);
			// matrix[h][w] = inRange(val,0.5,0.7);
			matrix[w][h] = Math.random() <= 0.1;
		}
	}
	return matrix;
};
