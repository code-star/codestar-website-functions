"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validated_1 = require("./Validated");
function parseArray(o) {
    if (Array.isArray(o)) {
        return Validated_1.ok(o);
    }
    else {
        return Validated_1.error(["Not an array"]);
    }
}
function parseObject(o, index) {
    if (typeof o === "object") {
        return Validated_1.ok(o);
    }
    else {
        return Validated_1.error([`Element at index ${index} is not an object`]);
    }
}
function parseUndefined(o, key, index) {
    if (o[key] === undefined) {
        return Validated_1.ok(o[key]);
    }
    else {
        return Validated_1.error([
            `Property ${key} of element at index ${index} is not undefined`
        ]);
    }
}
function parseNumber(o, key, index) {
    if (typeof o[key] === "number") {
        return Validated_1.ok(o[key]);
    }
    else {
        return Validated_1.error([
            `Property ${key} of element at index ${index} is not a number`
        ]);
    }
}
function parseShipPurchase(o, key, index) {
    const value = o[key];
    if (typeof value === "string" &&
        (value === "MediumFreighter" ||
            value === "HeavyFreighter" ||
            value === "Leviathan")) {
        return Validated_1.ok(value);
    }
    else {
        return Validated_1.error([
            `Property ${key} of element at index ${index} is not one of "MediumFreighter", "HeavyFreighter" or "Leviathan"`
        ]);
    }
}
function parseTransaction(o, index) {
    return Validated_1.obj({
        planetIndex: parseNumber(o, "planetIndex", index),
        deltaOre: parseNumber(o, "deltaOre", index),
        deltaWater: parseNumber(o, "deltaWater", index),
        deltaEngineParts: parseNumber(o, "deltaEngineParts", index),
        deltaContraband: Validated_1.alternative(parseUndefined(o, "deltaContraband", index), parseNumber(o, "deltaContraband", index)),
        shipPurchase: Validated_1.alternative(parseUndefined(o, "shipPurchase", index), parseShipPurchase(o, "shipPurchase", index))
    });
}
function parse(json) {
    return Validated_1.flatMap(parseArray(json), arr => {
        const validatedObjects = arr.map((e, index) => parseObject(e, index));
        const validatedTransactions = validatedObjects.map((vo, index) => Validated_1.flatMap(vo, o => parseTransaction(o, index)));
        return Validated_1.sequence(validatedTransactions);
    });
}
exports.parse = parse;
