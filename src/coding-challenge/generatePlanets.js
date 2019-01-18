/* eslint-disable */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("./random");
const MIN_PRICE = 1;
const MAX_PRICE = 20;
const CONTRA_BAND_FRACTION = 2;
function generatePlanets(seed, numberOfPlanets) {
  const random = random_1.createRandom(seed);
  const planets = [];
  for (let i = 0; i < numberOfPlanets; ++i) {
    const orePrice = random_1.toIntegerBetween(MIN_PRICE, MAX_PRICE, random());
    const waterPrice = random_1.toIntegerBetween(
      MIN_PRICE,
      MAX_PRICE,
      random()
    );
    const partsPrice = random_1.toIntegerBetween(
      MIN_PRICE,
      MAX_PRICE,
      random()
    );
    const factionNumber = random();
    const faction = factionNumber < 0.5 ? "Liberty" : "Black Moranth";
    const contrabandPrice =
      faction === "Black Moranth"
        ? random_1.toIntegerBetween(
            MIN_PRICE * CONTRA_BAND_FRACTION,
            MAX_PRICE * CONTRA_BAND_FRACTION,
            random()
          )
        : 0;
    planets.push({
      orePrice,
      waterPrice,
      partsPrice,
      faction,
      contrabandPrice
    });
  }
  return planets;
}
exports.generatePlanets = generatePlanets;
