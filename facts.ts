import * as fs from 'fs';

export const getRandomFact = async (
	channel: string,
	callback: (channel: string, line: string) => void
) => {
	await fs.readFile('facts.txt', (err, data) => {
		if (err) throw err;
		const lines = data.toString().split('\n');
		const line = lines[Math.floor(Math.random() * lines.length)];
		callback(channel, line);
	});
};
