"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFact = exports.getRandomFact = void 0;
const fs = __importStar(require("fs"));
const log_1 = require("./log");
/**
 * Reads a txt file and selects a random line which is sent to the callback
 * @param channel Channel to be passed on to the callback
 * @param callback The callback which will be called once a random line is selected
 */
exports.getRandomFact = async (channel, callback) => {
    // Facts.txt can be filled with interesting facts
    fs.readFile('facts.txt', (err, data) => {
        if (err)
            throw err; // I think we need to throw an error if the file cannot be read
        const lines = data.toString().split('\n'); // Read all lines as an array
        const line = lines[Math.floor(Math.random() * lines.length)]; // Choose a random line using some very advanced math, thanks SO
        callback(channel, line); // Call the callback with channel and the random line
    });
};
exports.addFact = async (fact, channel, callback) => {
    fs.appendFile('facts.txt', `\n${fact}`, (err) => {
        if (err)
            throw err;
        log_1.log('Added fact');
    });
    callback(channel);
};
