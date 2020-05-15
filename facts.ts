import * as fs from 'fs';

/**
 * Reads a txt file and selects a random line which is sent to the callback
 * @param channel Channel to be passed on to the callback
 * @param callback The callback which will be called once a random line is selected
 */
export const getRandomFact = async (
	channel: string,
	callback: (channel: string, line: string) => void
) => {
	fs.readFile('facts.txt', (err, data) => {
		if (err) throw err;
		const lines = data.toString().split('\n');
		const line = lines[Math.floor(Math.random() * lines.length)];
		callback(channel, line);
	});
};
