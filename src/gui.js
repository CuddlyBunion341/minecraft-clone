import { inRange } from "../lib/mathlib.js";
export const createGUI = () => {
	const init = () => {
		createHotbar();
		updateSelectedSlot(0);
	};

	const _hotbar = ["dirt", "grass", "stone", "planks", "log", "cobblestone", "diamond", "leaves"];
	let _selectedSlot;

	const createHotbar = () => {
		const hotbarElement = document.querySelector("#hotbar");
		if (!hotbarElement) throw new Error("Hotbarelement does not exist!");

		const elements = [];
		for (let i = 0; i < 9; i++) {
			const slot = document.createElement("div");
			slot.classList.add("slot");
			elements.push(slot);

			if (_hotbar[i]) {
				const blockImage = document.createElement("img");
				blockImage.src = `./images/gui/${_hotbar[i]}.webp`;
				slot.appendChild(blockImage);
			}

			hotbarElement.appendChild(slot);
		}

		document.addEventListener("keydown", e => {
			if (inRange(e.which, 49, 57)) updateSelectedSlot(parseInt(e.key) - 1);
		});
		document.addEventListener("wheel", e => {
			const delta = e.deltaY;
			const index = (_selectedSlot + Math.sign(delta) + 9) % 9; 
			updateSelectedSlot(index);
		});
	};

	const updateSelectedSlot = slotNumber => {
		if (slotNumber < 0 || slotNumber >= 9) return;
		_selectedSlot = slotNumber;
		const hotbar = document.querySelector("#hotbar");
		for (let i = 0; i < 9; i++) hotbar.childNodes[i].classList.remove("selected");
		hotbar.childNodes[slotNumber].classList.add("selected");
	};

	init();

	return {
		get selectedBlock() {
			return _hotbar[_selectedSlot];
		},
	};
};
