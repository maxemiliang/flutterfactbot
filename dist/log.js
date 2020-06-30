"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
/**
 * Fancy log wrapper, really unnecessary
 * @param msg Simply the message to log
 */
exports.log = (msg) => {
    if (process.env.NODE_ENV !== 'production')
        return console.debug(msg);
    console.log(msg);
};
