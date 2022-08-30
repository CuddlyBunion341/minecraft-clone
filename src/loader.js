import { TextureLoader, NearestFilter, LinearFilter } from "three";

/* This is creating a new TextureLoader object, and setting the path to the images folder. */
const loader = new TextureLoader();
loader.setPath("images/");

/**
 * Loads a texture from a file and sets the min and mag filters to NearestFilter
 * @param name - The name of the texture.
 * @param [callback] - A function that will be called when the texture is loaded.
 * @returns A texture object.
 */
const blockTexture = (name, callback = () => {}) => {
	const texture = loader.load(`${name}.png`, callback);
	texture.magFilter = NearestFilter;
	texture.minFilter = NearestFilter;
	return texture;
};

/**
 * Loads a bunch of textures, and calls a callback when they're all loaded
 * @param [textures] - An array of texture names or texture arrays.
 * @param [onload] - A function that will be called when all the textures have been loaded.
 */
export const loadTextures = (
	textures = ["dirt", "stone", ["beans", "raw_iron_block"], "bedrock", ["all", "atlas"]],
	onload = () => {}
) => {
	const loadedTextures = {};
	let leftToLoad = textures.length;
	for (const textureName of textures) {
		const [key, name] = typeof textureName == "string" ? [textureName] : textureName;
		loader.load(`block/${name || key}.png`,(texture) => {
			texture.magFilter = NearestFilter;
			texture.minFilter = LinearFilter;
			loadedTextures[key] = texture;
			leftToLoad--;
			if (!leftToLoad) return onload(loadedTextures);
		},undefined,() => {
			leftToLoad--;
			console.error(`Texture ${textureName} does not exist!`);
		})
	}
};

export const loadImage = (imgName, onLoad = () => {}) => {
	loader.load(imgName, onLoad);
}

// export const loadedTextures = loadTextures("dirt", "stone", ["beans", "raw_iron_block"], "bedrock", ["all", "atlas"]);
