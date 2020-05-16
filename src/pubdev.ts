import * as tmi from 'tmi.js';
import axios from 'axios';
import loki from 'lokijs';
import { log } from './log';

// Initalize the database in memeory
const db = new loki('pubdevpackages', {
	persistenceMethod: 'memory',
});
const packages = db.addCollection('packages'); // Create a collection

/**
 * Calls pub.dev api and retrieves the package info. finally calls the callback
 * @param channel channel that the callback will recieve
 * @param tags tags from twitch, stuff like who sent the message and so forth
 * @param search search term, should be somewhat sanitized
 * @param callback function that will be called once the api request is done
 */
export const getPubDevPackageInfo = (
	channel: string,
	tags: tmi.ChatUserstate,
	search: string,
	callback: (channel: string, tags: tmi.ChatUserstate, resp: any | null) => void
) => {
	const existingPackage = packages.find({ name: search }); // Check our "cache"
	if (existingPackage.length === 0)
		// If we didn't find anything, do go on
		axios
			.get(`https://pub.dartlang.org/api/packages/${search}`, {
				headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' }, // We set a custom user-agent
			})
			.then((res) => {
				if (res.status === 200) {
					log(`[CACHE] MISS: ${search}`); // Log that we missed cache
					packages.insert(res.data); // Create cache record
					callback(channel, tags, res.data); // Callback
				} else callback(channel, tags, null); // if we get an error then we callback, using null, not the best solution
			})
			.catch((err) => {
				// Way to big error, often for a 404 or something similar, so no point to log the message
				log('[AXIOS] Error with request');
				callback(channel, tags, null); // Callback with null to signal error, safe and sound
			});
	else {
		log(`[CACHE] HIT: ${existingPackage[0].name}`); // Log that we hit the cache
		callback(channel, tags, existingPackage[0]); // Callback using cached data
	}
};
