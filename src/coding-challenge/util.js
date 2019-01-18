/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(outer) {
  const result = [];
  outer.forEach(inner => {
    inner.forEach(a => {
      result.push(a);
    });
  });
  return result;
}
exports.flatten = flatten;
function flatMap(arr, fn) {
  return flatten(arr.map(fn));
}
exports.flatMap = flatMap;
function range(upperBoundExclusive) {
  return Array(upperBoundExclusive)
    .fill(undefined)
    .map((v, index) => index);
}
exports.range = range;
function rangeFrom(lowerBoundInclusive, upperBoundExclusive) {
  return range(upperBoundExclusive - lowerBoundInclusive).map(
    n => n + lowerBoundInclusive
  );
}
exports.rangeFrom = rangeFrom;
function max(arr, compare) {
  if (arr.length === 0) {
    throw new Error("Need at least one element!");
  }
  return arr.reduce((acc, curr) => {
    const compared = compare(acc, curr);
    if (compared < 0) {
      return curr;
    } else {
      return acc;
    }
  });
}
exports.max = max;
