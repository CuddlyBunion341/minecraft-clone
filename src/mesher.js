import { MeshNormalMaterial } from "three";
import { BufferAttribute } from "three";
import { MeshPhongMaterial } from "three";
import { MeshBasicMaterial } from "three";
import { CubeUVReflectionMapping } from "three";
import { VertexColors } from "three";
import { MeshStandardMaterial } from "three";
import { MeshMatcapMaterial } from "three";
import { MeshLambertMaterial } from "three";
import { Mesh } from "three";
import { BufferGeometry } from "three";
import faceGeometries from "./geometry.js";
import { blockTextureMapping, getFaceIndex } from "./texture-mapper.js";

export const createChunkMesh = (mainChunk, northChunk, eastChunks, southChunk, westChunk, [atlas, ranges]) => {
	const positions = [];
	const normals = [];
	const colors = [];
	const uvs = [];

	for (let y = 0; y < mainChunk.dimensions[1]; y++) {
		for (let x = 0; x < 32; x++) {
			for (let z = 0; z < 32; z++) {
				const voxel = mainChunk.getCell(x, y, z);
				if (!voxel) continue;

				const showFace = neighbor => !neighbor;
				const getVoxel = (x, y, z) => {
					if (x < 0) return westChunk.getCell(31, y, z);
					if (z < 0) return northChunk.getCell(x, y, 31);
					if (x > 31) return eastChunks.getCell(0, y, z);
					if (z > 31) return southChunk.getCell(x, y, 0);
					return mainChunk.getCell(x, y, z);
				};
				const voxelTextures = blockTextureMapping[voxel] || new Array(6).fill("dirt");
				if (!voxelTextures) console.error(voxel);

				const faces = [];
				faces.push({ show: showFace(getVoxel(x, y, z + 1)), name: "north" });
				faces.push({ show: showFace(getVoxel(x, y, z - 1)), name: "south" });
				faces.push({ show: showFace(getVoxel(x + 1, y, z)), name: "east" });
				faces.push({ show: showFace(getVoxel(x - 1, y, z)), name: "west" });
				faces.push({ show: showFace(getVoxel(x, y + 1, z)), name: "up" });
				faces.push({ show: showFace(getVoxel(x, y - 1, z)), name: "down" });

				for (const face of faces) {
					if (!face.show) continue;
					const vertices = faceGeometries[face.name];

					const texture = voxelTextures[getFaceIndex(face.name)];

					const range = ranges[texture];
					// throw new Error(JSON.stringify({range,ranges}));
					if (!range) console.error(`No range for texture '${texture}'`);

					let i = 0;
					for (const vertex of vertices) {
						positions.push(...vertex.pos.map((v, i) => v + [x, y, z][i]));
						normals.push(...vertex.norm);

						let [u, v] = vertex.uv;
						u = u ? range[2] : range[0];
						v = v ? range[3] : range[1];

						uvs.push(u, v);
					}
				}
			}
		}
	}
	const geometry = new BufferGeometry();

	const positionNumComponents = 3;
	const normalNumComponents = 3;
	const uvNumComponents = 2;
	geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), positionNumComponents));
	geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), normalNumComponents));
	geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), uvNumComponents));

	const material = new MeshMatcapMaterial({ map: atlas });
	// const material = new MeshLambertMaterial({map: atlas});
	// const material = new MeshStandardMaterial();

	const mesh = new Mesh(geometry, material);

	// mesh.castShadow = true;
	// mesh.receiveShadow = true;

	return mesh;
};
