import * as tmi from 'tmi.js';
import axios from 'axios';
import loki from 'lokijs';
import { log } from './log';

const db = new loki('pubdev', {
	persistenceMethod: 'memory',
});
const packages = db.addCollection('packages');

export const getPubDevPackageInfo = (
	channel: string,
	tags: tmi.ChatUserstate,
	search: string,
	callback: (channel: string, tags: tmi.ChatUserstate, resp: any | null) => void
) => {
	const existingPackage = packages.find({ name: search });
	if (existingPackage.length === 0)
		axios
			.get(`https://pub.dartlang.org/api/packages/${search}`, {
				headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' },
			})
			.then((res) => {
				if (res.status === 200) {
					log(`[CACHE] MISS: ${search}`);
					packages.insert(res.data);
					callback(channel, tags, res.data);
				} else callback(channel, tags, null);
			})
			.catch((err) => {
				console.error(err);
				callback(channel, tags, null);
			});
	else {
		log(`[CACHE] HIT: ${existingPackage[0].name}`);
		callback(channel, tags, existingPackage[0]);
	}
};
