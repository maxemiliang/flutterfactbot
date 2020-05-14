import * as tmi from 'tmi.js';
import { getRandomFact } from './facts';

const client = tmi.Client({
	options: {
		debug: process.env.NODE_ENV == 'production' ? false : true,
	},
	connection: {
		reconnect: true,
		secure: true,
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_OAUTH,
	},
	channels: ['rushkib', 'pixelogicdev'],
});

client.connect();
client.on('message', (channel, tags, message, self) => {
	if (self) return;
	const command = message.trim().split(' ')[0];
	const arg = message.trim().split(' ').length > 1 ? message.split(' ')[1] : '';
	if (command.toLowerCase() === '!ffotd') {
		getRandomFact(channel, sendMessage);
	}
});

const sendMessage = (channel: string, line: string) => {
	client
		.say(channel, `Flutter fact of the day: ${line} #ffotd`)
		.catch(console.error);
};
