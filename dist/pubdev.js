"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPubDevPackageInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const lokijs_1 = __importDefault(require("lokijs"));
const log_1 = require("./log");
// Initalize the database in memeory
const db = new lokijs_1.default('pubdevpackages', {
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
exports.getPubDevPackageInfo = (channel, tags, search, callback) => {
    const existingPackage = packages.find({ name: search }); // Check our "cache"
    if (existingPackage.length === 0)
        // If we didn't find anything, do go on
        axios_1.default
            .get(`https://pub.dartlang.org/api/packages/${search}`, {
            headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' },
        })
            .then((res) => {
            if (res.status === 200) {
                log_1.log(`[CACHE] MISS: ${search}`); // Log that we missed cache
                packages.insert(res.data); // Create cache record
                callback(channel, tags, res.data); // Callback
            }
            else
                callback(channel, tags, null); // if we get an error then we callback, using null, not the best solution
        })
            .catch((err) => {
            // Way to big error, often for a 404 or something similar, so no point to log the message
            log_1.log('[AXIOS] Error with request');
            callback(channel, tags, null); // Callback with null to signal error, safe and sound
        });
    else {
        log_1.log(`[CACHE] HIT: ${existingPackage[0].name}`); // Log that we hit the cache
        callback(channel, tags, existingPackage[0]); // Callback using cached data
    }
};
