import noise from "../lib/perlin.js";
import { map, inRange, createMatrix3d, max } from "../lib/mathlib.js";
import { makeRectangle } from "fractal-noise";

const WorldGenerator = function (seed) {
	noise.seed(seed || Math.random());
	const generate = (
		x,
		z,
		width,
		length,
		{ factor, minHeight } = { factor: 20, minHeight: 40 }
	) => {
		const heightMap = createHeightMap(x, z, width, length, {
			factor,
			minHeight,
		});
		let maxHeight = heightMap.reduce((max, row) => {
			const height = row.reduce((a, v) => (v > a ? v : a));
			return Math.max(max, height);
		}, 0);

		const layers = createMatrix3d(width, 128, length, 0);

		for (let x = 0; x < width; x++) {
			for (let z = 0; z < length; z++) {
				const waterLevel = 35;
				const height = heightMap[x][z];
				for (let y = 0; y < height; y++) {
					const isSurface = y == height - 1;
					let block = "dirt";
					if (y == 0) block = "bedrock";
					else if (isSurface && y <= waterLevel) block = "sand";
					// else if (y >= 50) block = "stone";
					else if (y <= height - 5) {
						if (y <= 16 && Math.random() <= 0.01) block = "diamond";
						else block = "stone";
					} else if (isSurface) block = "grass";
					layers[y][x][z] = block;

					// if (y > height && y < 100) layers[y][x][z] = "glass";
					// layers[y][x][z] = "stone";
				}
				for (let y = height; y < waterLevel; y++) {
					layers[y][x][z] = "water";
				}
				if (height <= waterLevel) {
					maxHeight = Math.max(waterLevel, maxHeight);
				}

				const willSpawnTree =
					height > waterLevel &&
					Math.random() <= 0.02 &&
					height < maxHeight - 10 &&
					inRange(x, 5, width - 5) &&
					inRange(z, 5, length - 5);
				/**
				 * It takes a position and a tree matrix and places the tree at that position
				 * @param x - The x coordinate of the tree.
				 * @param y - The y coordinate of the tree.
				 * @param z - The z coordinate of the tree.
				 */
				const spawnTree = (x, y, z) => {
					const treeMatrix = [
						[
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 1, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
						],

						[
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 1, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
						],

						[
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 1, 0, 0],
							[0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0],
						],
						[
							[0, 2, 2, 2, 0],
							[2, 2, 2, 2, 2],
							[2, 2, 1, 2, 2],
							[2, 2, 2, 2, 2],
							[0, 2, 2, 2, 0],
						],

						[
							[0, 2, 2, 2, 0],
							[2, 2, 2, 2, 2],
							[2, 2, 1, 2, 2],
							[2, 2, 2, 2, 2],
							[0, 2, 2, 2, 0],
						],

						[
							[0, 0, 0, 0, 0],
							[0, 2, 2, 2, 0],
							[0, 2, 1, 2, 0],
							[0, 2, 2, 2, 0],
							[0, 0, 0, 0, 0],
						],

						[
							[0, 0, 0, 0, 0],
							[0, 0, 2, 0, 0],
							[0, 2, 2, 2, 0],
							[0, 0, 2, 0, 0],
							[0, 0, 0, 0, 0],
						],
					];
					for (let xi = 0; xi < 5; xi++) {
						for (let zi = 0; zi < 5; zi++) {
							for (let yi = 0; yi < treeMatrix.length; yi++) {
								const pallette = [0, "oak_log", "leaves"];
								const block = pallette[treeMatrix[yi][xi][zi]];
								try {
									block &&
										(layers[yi + y][xi + x][zi + z] =
											block);
								} catch (e) {
									console.error(e);
									console.log(
										`layers[${yi + y}][${xi + x}][${
											zi + z
										}] = ${block}`
									);
								}
							}
						}
					}
				};
				if (willSpawnTree) spawnTree(x, height - 1, z);
			}
		}

		const inBounds = (x, y, z) => {
			if (x < 0 || x >= width) return false;
			if (y < 0 || y >= 128) return false;
			if (z < 0 || z >= length) return false;
			return true;
		};

		const getCell = (x, y, z) => {
			if (!inBounds(x, y, z)) return;
			return layers[y][x][z];
		};

		const setCell = (x, y, z, block) => {
			if (!inBounds(x, y, z)) return;
			if (y >= maxHeight) maxHeight = y + 1;
			layers[y][x][z] = block;
		};

		return {
			get dimensions() {
				return [width, maxHeight, length];
			},
			data: layers,
			getCell,
			setCell,
		};
	};

	const createHeightMap = (
		origin_x,
		origin_y,
		width,
		height,
		{ factor = 20, minHeight = 40 }
	) => {
		const octaves = 3;
		const frequency = 0.01;
		const amplitude = 5;

		const heightMap = new Array(height);
		for (let x = 0; x < width; x++) {
			heightMap[x] = new Array(height);
			for (let y = 0; y < height; y++) {
				let val = 0;
				for (let oct = 0; oct < octaves; oct++) {
					let freq = frequency * Math.pow(2, oct);
					val +=
						noise.simplex2(
							x * freq + origin_x * freq,
							y * freq + origin_y * freq
						) *
						(amplitude * Math.pow(0.5, oct));
				}
				val /= 2 - 1 / Math.pow(2, octaves - 1);
				val *= 4;
				val += minHeight;
				heightMap[x][y] = val | 0;
			}
		}
		return heightMap;
	};

	return { generate, createHeightMap };
};

export default WorldGenerator;
