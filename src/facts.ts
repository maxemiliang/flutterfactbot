import * as fs from 'fs';
import tmi from 'tmi.js';
import { log } from './log';

/**
 * Reads a txt file and selects a random line which is sent to the callback
 * @param channel Channel to be passed on to the callback
 * @param callback The callback which will be called once a random line is selected
 */
export const getRandomFact = async (
	channel: string,
	callback: (channel: string, line: string) => void
) => {
	// Facts.txt can be filled with interesting facts
	fs.readFile('facts.txt', (err, data) => {
		if (err) throw err; // I think we need to throw an error if the file cannot be read
		const lines = data.toString().split('\n'); // Read all lines as an array
		const line = lines[Math.floor(Math.random() * lines.length)]; // Choose a random line using some very advanced math, thanks SO
		callback(channel, line); // Call the callback with channel and the random line
	});
};
