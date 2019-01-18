/* eslint-disable */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const fs_1 = require('fs');
function planetToFile(fileName, planets, separator = ',') {
  const csvLines = planets.map(
    ({ orePrice, waterPrice, partsPrice, faction, contrabandPrice }, index) =>
      [
        index + 1,
        orePrice,
        waterPrice,
        partsPrice,
        faction,
        contrabandPrice,
      ].join(separator)
  );
  const csv =
    'Index,Ore price,Water price,Engine parts,Faction,Contraband price\n' +
    csvLines.join('\n');
  fs_1.writeFile(fileName, csv, e => {
    console.error(e);
  });
}
exports.planetToFile = planetToFile;
