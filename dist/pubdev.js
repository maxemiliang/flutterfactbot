"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPubDevPackageInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const lokijs_1 = __importDefault(require("lokijs"));
const log_1 = require("./log");
const db = new lokijs_1.default('pubdev', {
    persistenceMethod: 'memory',
});
const packages = db.addCollection('packages');
exports.getPubDevPackageInfo = (channel, tags, search, callback) => {
    const existingPackage = packages.find({ name: search });
    if (existingPackage.length === 0)
        axios_1.default
            .get(`https://pub.dartlang.org/api/packages/${search}`, {
            headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' },
        })
            .then((res) => {
            if (res.status === 200) {
                log_1.log(`[CACHE] MISS: ${search}`);
                packages.insert(res.data);
                callback(channel, tags, res.data);
            }
            else
                callback(channel, tags, null);
        })
            .catch((err) => {
            log_1.log('[AXIOS] Error with request');
            callback(channel, tags, null);
        });
    else {
        log_1.log(`[CACHE] HIT: ${existingPackage[0].name}`);
        callback(channel, tags, existingPackage[0]);
    }
};
