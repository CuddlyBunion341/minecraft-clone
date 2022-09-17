const faceGeometries = {
	north: [
		{ shade: 1, pos: [0, 0, 1], norm: [0, 0, 1], uv: [0, 1] },
		{ shade: 1, pos: [1, 0, 1], norm: [0, 0, 1], uv: [1, 1] },
		{ shade: 1, pos: [0, 1, 1], norm: [0, 0, 1], uv: [0, 0] },

		{ shade: 1, pos: [0, 1, 1], norm: [0, 0, 1], uv: [0, 0] },
		{ shade: 1, pos: [1, 0, 1], norm: [0, 0, 1], uv: [1, 1] },
		{ shade: 1, pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 0] },
	],
	east: [
		{ shade: 2, pos: [1, 0, 1], norm: [1, 0, 0], uv: [0, 1] },
		{ shade: 2, pos: [1, 0, 0], norm: [1, 0, 0], uv: [1, 1] },
		{ shade: 2, pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },

		{ shade: 2, pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 0] },
		{ shade: 2, pos: [1, 0, 0], norm: [1, 0, 0], uv: [1, 1] },
		{ shade: 2, pos: [1, 1, 0], norm: [1, 0, 0], uv: [1, 0] },
	],
	south: [
		{ shade: 1, pos: [1, 0, 0], norm: [0, 0, -1], uv: [0, 1] },
		{ shade: 1, pos: [0, 0, 0], norm: [0, 0, -1], uv: [1, 1] },
		{ shade: 1, pos: [1, 1, 0], norm: [0, 0, -1], uv: [0, 0] },

		{ shade: 1, pos: [1, 1, 0], norm: [0, 0, -1], uv: [0, 0] },
		{ shade: 1, pos: [0, 0, 0], norm: [0, 0, -1], uv: [1, 1] },
		{ shade: 1, pos: [0, 1, 0], norm: [0, 0, -1], uv: [1, 0] },
	],
	west: [
		{ shade: 2, pos: [0, 0, 0], norm: [-1, 0, 0], uv: [0, 1] },
		{ shade: 2, pos: [0, 0, 1], norm: [-1, 0, 0], uv: [1, 1] },
		{ shade: 2, pos: [0, 1, 0], norm: [-1, 0, 0], uv: [0, 0] },

		{ shade: 2, pos: [0, 1, 0], norm: [-1, 0, 0], uv: [0, 0] },
		{ shade: 2, pos: [0, 0, 1], norm: [-1, 0, 0], uv: [1, 1] },
		{ shade: 2, pos: [0, 1, 1], norm: [-1, 0, 0], uv: [1, 0] },
	],
	up: [
		{ shade: 0, pos: [1, 1, 0], norm: [0, 1, 0], uv: [0, 1] },
		{ shade: 0, pos: [0, 1, 0], norm: [0, 1, 0], uv: [1, 1] },
		{ shade: 0, pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },

		{ shade: 0, pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 0] },
		{ shade: 0, pos: [0, 1, 0], norm: [0, 1, 0], uv: [1, 1] },
		{ shade: 0, pos: [0, 1, 1], norm: [0, 1, 0], uv: [1, 0] },
	],
	down: [
		{ shade: 3, pos: [1, 0, 1], norm: [0, -1, 0], uv: [0, 1] },
		{ shade: 3, pos: [0, 0, 1], norm: [0, -1, 0], uv: [1, 1] },
		{ shade: 3, pos: [1, 0, 0], norm: [0, -1, 0], uv: [0, 0] },

		{ shade: 3, pos: [1, 0, 0], norm: [0, -1, 0], uv: [0, 0] },
		{ shade: 3, pos: [0, 0, 1], norm: [0, -1, 0], uv: [1, 1] },
		{ shade: 3, pos: [0, 0, 0], norm: [0, -1, 0], uv: [1, 0] },
	],
};
export default faceGeometries;
