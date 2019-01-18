/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createRandom(s) {
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}
exports.createRandom = createRandom;
function toIntegerBetween(
  lowerBoundInclusive,
  upperBoundExclusive,
  randomNumber
) {
  return Math.floor(
    randomNumber * (upperBoundExclusive - lowerBoundInclusive) +
      lowerBoundInclusive
  );
}
exports.toIntegerBetween = toIntegerBetween;
