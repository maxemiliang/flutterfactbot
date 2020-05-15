"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPubDevPackageInfo = void 0;
const axios_1 = __importDefault(require("axios"));
exports.getPubDevPackageInfo = (channel, search, callback) => {
    axios_1.default
        .get(`https://pub.dartlang.org/api/packages/${search}`, {
        headers: { 'User-Agent': 'PubDev-Twitch-Search-Bot v0.1.0' },
    })
        .then((res) => {
        callback(channel, res);
    })
        .catch((err) => {
        console.error(err);
        callback(channel, null);
    });
};
