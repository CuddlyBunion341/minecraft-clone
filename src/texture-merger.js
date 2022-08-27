import { CanvasTexture, NearestFilter } from "three";
/**
 * Create a canvas element with the given width and height
 * @param width - The width of the canvas in pixels.
 * @param height - The height of the canvas in pixels.
 * @returns A canvas element.
 */
const createCanvas = (width, height) => {
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

const getAtlasWidth = textureCount => {
	let square = 1;
	let width = 1;

	while (textureCount > square) {
		width++;
		square = width * width;
	}
	return width;
};

/**
 * It takes a map of textures and returns a new texture with all the textures merged into it, along
 * with a map of texture names to texture coordinates
 * @returns An object with two properties: atlas and ranges.
 */
export const mergeTextures = textureMap => {
	const textureCount = Object.keys(textureMap).length;
	const atlasWidth = getAtlasWidth(textureCount);
	const pixel = 1 / atlasWidth;
	const side = atlasWidth;

	const canvas = createCanvas(side * 16, side * 16);
	const ctx = canvas.getContext("2d");

	const ranges = {};

	let x = 0;
	let y = 0;
	for (const textureName in textureMap) {
		ctx.drawImage(textureMap[textureName].image, x * 16, y * 16);

		ranges[textureName] = [x * pixel, (side - y) * pixel, ++x * pixel, (side - y - 1) * pixel];

		x == side && (x = ++y - y);
	}
	const canvasTexture = new CanvasTexture(canvas);
	canvasTexture.magFilter = NearestFilter;
	canvasTexture.minFilter = NearestFilter;
	return { atlas: canvasTexture, ranges };
};
