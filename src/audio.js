export const createAudioControler = toLoad => {
	const init = () => {
		loadAudio(toLoad);
	};

	const audios = {};

	const loadAudio = files => {
		for (const file of files) audios[file] = new Audio(`sounds/${file}.ogg`);
	};

	const play = name => {
		const audio = audios[name].cloneNode(true);
		audio.volume = 0.1;
		audio.play();
	};

	init();

	return {
		play,
		loadAudio,
	};
};
