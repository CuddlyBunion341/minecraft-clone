import * as Mesher from "./mesher.js";
import WorldGenerator from "./world-generator.js";
import { loadTextures } from "./loader.js";
import { mergeTextures } from "./texture-merger.js";
import { createChunkMesh } from "./mesher.js";
import { inRange } from "../lib/mathlib.js";
import { BoxHelper } from "three";
import { ParticleSystem } from "three";
import { createAudioControler } from "./audio.js";
import { Group } from "three";
import { BoundingBoxHelper } from "three";

export default function World(scene, renderDistance, seed) {
	seed = seed ?? Math.random();

	this.chunks = [];
	const generator = new WorldGenerator(seed);
	const audioController = createAudioControler([
		"dirt",
		"grass",
		"stone",
		"wood",
	]);
	const worldGroup = new Group();
	scene.add(worldGroup);
	this.worldGroup = worldGroup;

	var self = this;

	const init = () => {
		const toLoad = [
			"dirt",
			"stone",
			["beans", "raw_iron_block"],
			"lime_concrete",
			"blue_concrete",
			"orange_concrete",
			"grass_top",
			"grass_side",
			"bedrock",
			"oak_log",
			"oak_log_top",
			"leaves",
			"glass",
			["planks", "oak_planks"],
			["diamond", "diamond_ore"],
			"cobblestone",
			"sand",
			"ice",
			"water",
		];
		loadTextures(toLoad, (loadedTextures) => {
			const { atlas, ranges } = mergeTextures(loadedTextures);
			this.atlas = atlas;
			this.ranges = ranges;

			console.log(atlas.source.data.toDataURL());
			console.log(ranges);

			setTimeout(() => createChunks(0, 0, renderDistance), 0);
		});
	};

	const chunkExists = (x, y) =>
		this.chunks.some((chunk) => chunk.x == x && chunk.y == y);

	const render = (x, y, distance) => {
		this.chunks.forEach((chunk) => {
			if (
				inRange(chunk.x, x - distance, x + distance) &&
				inRange(chunk.y, y - distance, y + distance)
			)
				return;
			chunk.hide();
		});
		for (let i = x - distance; i < x + distance; i++) {
			for (let j = y - distance; j < y + distance; j++) {
				setTimeout(() => createChunk(i, j), 0);
				// createChunk(i,j);
			}
		}
	};
	this.render = render;

	const createChunk = (x, y) => {
		generateChunk(x, y);
		generateChunk(x - 1, y);
		generateChunk(x + 1, y);
		generateChunk(x, y + 1);
		generateChunk(x, y - 1);

		generateMeshChunk(x, y);
	};
	this.createChunk = createChunk;

	const createChunks = (x, y, radius = 10) => {
		for (let i = -radius; i <= radius; i++) {
			for (let j = -radius; j <= radius; j++) {
				setTimeout(() => createChunk(x + i, y + j), 0);
			}
		}
	};
	this.createChunks = createChunks;

	/**
	 * Generate a chunk if it doesn't exist
	 * @param x - The x coordinate of the chunk.
	 * @param y - The y coordinate of the chunk.
	 * @returns Nothing.
	 */
	const generateChunk = (x, y) => {
		if (chunkExists(x, y)) return;
		const chunk = new Chunk(x, y, {
			atlas: this.atlas,
			ranges: this.ranges,
		});
		this.chunks.push(chunk);
	};

	const getChunk = (x, y) =>
		this.chunks.find((chunk) => chunk.x == x && chunk.y == y);

	const generateMeshChunk = (x, y, override = false) => {
		const mainChunk = getChunk(x, y);
		const northChunk = getChunk(x, y - 1);
		const southChunk = getChunk(x, y + 1);
		const eastChunk = getChunk(x + 1, y);
		const westChunk = getChunk(x - 1, y);

		if (!mainChunk) throw new Error("Main Chunk not loaded!");
		[northChunk, southChunk, eastChunk, westChunk].forEach((chunk) => {
			if (!chunk) throw new Error("Chunk not loaded!");
		});
		mainChunk.setNeibours(northChunk, eastChunk, southChunk, westChunk);
		mainChunk.createMesh(override);
	};

	const setBlock = (x, y, z, block) => {
		const chunkX = Math.floor(x / 16);
		const chunkY = Math.floor(z / 16);
		let chunk = getChunk(chunkX, chunkY);
		if (!chunk) {
			createChunk(chunkX, chunkY);
			chunk = getChunk(chunkX, chunkY);
		}

		const playAudio = (b) => {
			setTimeout(() => {
				const path =
					{
						dirt: "dirt",
						leaves: "grass",
						grass: "grass",
						diamond: "stone",
						stone: "stone",
						planks: "wood",
						log: "wood",
					}[b] || "stone";
				audioController.play(path);
			}, 0);
		};

		const oldBlock = chunk.getBlock(x - chunkX * 16, y, z - chunkY * 16);
		if (chunk.setBlock(x - chunkX * 16, y, z - chunkY * 16, block)) {
			playAudio(oldBlock || block);
			const _x = (x + 16) % 16;
			const _z = (z + 16) % 16;
			chunk.createMesh(true);

			const neighbors = chunk.neighbors;
			if (_x === 0) neighbors[3].createMesh(true);
			if (_z === 0) neighbors[0].createMesh(true);
			if (_x === 15) neighbors[1].createMesh(true);
			if (_z === 15) neighbors[2].createMesh(true);
		}
	};
	this.placeBlock = setBlock;

	const removeBlock = (x, y, z) => {
		setBlock(x, y, z, 0);
	};
	this.removeBlock = removeBlock;

	const getBlock = (x, y, z) => {
		[x, y, z] = [x | 0, y | 0, z | 0];
		const chunkX = Math.floor(x / 16);
		const chunkY = Math.floor(z / 16);
		let chunk = getChunk(chunkX, chunkY);
		if (chunk) {
			return chunk.getBlock((16 + x) % 16, y, (16 + z) % 16);
		}
	};
	this.getBlock = getBlock;

	const Chunk = function (x, y, { atlas, ranges }) {
		const size = 16;
		const voxels = generator.generate(x * size, y * size, size, size);

		this.voxels = voxels;
		// this.getCell = voxels.getCell;

		this.setNeibours = (northChunk, eastChunk, southChunk, westChunk) =>
			(this.neighbors = [northChunk, eastChunk, southChunk, westChunk]);

		this.createMesh = (override) => {
			if (this.mesh && !override) return (this.mesh.visible = true);
			if (this.mesh) worldGroup.remove(this.mesh);
			const voxels = [
				this.voxels,
				...this.neighbors.map((v) => v.voxels),
			];
			const mesh = createChunkMesh(...voxels, [self.atlas, self.ranges]);
			mesh.position.set(x * size, 0, y * size);
			worldGroup.add(mesh);

			this.mesh = mesh;
		};

		this.setBlock = (x, y, z, value = "stone") => {
			if ([value, "bedrock"].includes(this.voxels.getCell(x, y, z)))
				return false;
			this.voxels.setCell(x, y, z, value);
			return true;
		};

		this.getBlock = (x, y, z) => {
			return this.voxels.getCell(x, y, z);
		};

		this.hide = () => {
			if (this.mesh) this.mesh.visible = false;
		};

		this.x = x;
		this.y = y;
	};
	this.generateChunk = generateChunk;
	init();
}
