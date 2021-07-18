import * as base64 from './base64.js';

export const arrToNum = (arr) => {
	const buffer = (arr.length % 8 > 0) ? 8 - (arr.length % 8) : 0;
	arr = new Array(buffer).fill(0).concat(arr.map(el => +el));
	
	let bytes = [];
	while (arr.length > 0) bytes.push(arr.splice(0, 8));
	bytes = bytes.map(byte => parseInt(byte.join(''), 2));
	
	const uint8 = Uint8Array.from(bytes);
	
	return base64.bytesToBase64(uint8);
};

export const numToArr = (num, len = 0) => {
	const bytes = base64.base64ToBytes(num);
	const arr = Array.from(bytes)
		.map(byte => byte.toString(2).padStart(8,'0'))
		.join('').split('')
		.map(bit => !!parseInt(bit));
	if (arr.length > len && len > 0) arr.splice(0, arr.length - len);
	return arr;
};

export const setHash = (hash) => window.location.hash = '#' + hash;
export const getHash = () => window.location.hash.slice(1);
