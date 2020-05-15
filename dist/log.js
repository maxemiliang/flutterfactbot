"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
exports.log = (msg) => {
    if (process.env.NODE_ENV !== 'production')
        return console.debug(msg);
    console.log(msg);
};
