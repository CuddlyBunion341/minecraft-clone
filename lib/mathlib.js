/**
 * Given a value, return a new value that is mapped to a new range
 * @param value - The value to be mapped to the new range.
 * @param x1 - the value of the input that corresponds to the output value of 0.
 * @param y1 - the value of the input at the lower bound of the range
 * @param x2 - the value of the input
 * @param y2 - the maximum value of the range.
 */
export const map = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
/**
 * Check if a value is in a range.
 * @param value - The value to check.
 * @param start - The start of the range.
 * @param end - The maximum value of the range.
 */
export const inRange = (value, start, end) => value >= start && value <= end;
export const max = values => values.reduce((max, val) => Math.max(max, val));
export const min = values => values.reduce((min, val) => Math.min(min, val));
/**
 * Given an array of values, return a new array with the values from the original array that are not in
 * the second array
 * @param original - The array you want to subtract from.
 * @param subtract - The array of values to remove from the original array.
 * @returns An array of strings.
 */
export const subtract = (original, subtract) => {
	return original.filter(v => !subtract.includes(v));
};
/**
 * Add takes an array and any number of additional arrays, and returns a new array containing all the
 * elements of the original array, and all the additional arrays
 * @param original - The array to add to.
 * @param arrays - An array of arrays to be added to the original array.
 * @returns An array.
 */
export const add = (original, ...arrays) => {
	const clone = [...original];
	for (const array of arrays) {
		clone.push(...array);
	}
	return clone;
};

/**
 * Create a 3D array of the specified dimensions, with the specified fill value
 * @param w - width
 * @param h - height
 * @param d - The number of dimensions in the matrix.
 * @param [fill=0] - The value to fill the matrix with.
 */
export const createMatrix3d = (w, h, d, fill = 0) =>
	new Array(h).fill().map(_ => new Array(w).fill().map(_ => new Array(d).fill(fill)));
/**
 * Create a 2D array of the given width and height, and fill it with the given fill value
 * @param w - The width of the matrix.
 * @param h - height of the matrix
 * @param [fill=0] - The value to fill the array with.
 */
export const createMatrix2d = (w, h, fill = 0) => new Array(w).fill().map(_ => new Array(h).fill().fill(fill));
/**
 * Check if the value is undefined.
 * @param value - The value to check.
 */
export const isUndefined = (value) => typeof value == "undefined";