"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OK = "OK";
function ok(value) {
    return {
        type: exports.OK,
        value
    };
}
exports.ok = ok;
exports.ERROR = "ERROR";
function error(errors) {
    return {
        type: exports.ERROR,
        errors
    };
}
exports.error = error;
function sequence(vs) {
    const errors = [];
    const values = [];
    vs.forEach(v => {
        if (v.type === exports.OK) {
            values.push(v.value);
        }
        else {
            errors.push(...v.errors);
        }
    });
    return errors.length === 0 ? ok(values) : error(errors);
}
exports.sequence = sequence;
function keys(o) {
    return Object.keys(o);
}
function obj(vs) {
    const o = {};
    const errors = [];
    keys(vs).forEach(key => {
        const v = vs[key];
        if (v.type === exports.OK) {
            o[key] = v.value;
        }
        else {
            errors.push(...v.errors);
        }
    });
    return errors.length === 0 ? ok(o) : error(errors);
}
exports.obj = obj;
function alternative(first, second) {
    if (first.type === exports.OK) {
        return first;
    }
    else {
        return second;
    }
}
exports.alternative = alternative;
function flatMap(v, fn) {
    if (v.type === exports.OK) {
        return fn(v.value);
    }
    else {
        return v;
    }
}
exports.flatMap = flatMap;
