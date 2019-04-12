/* eslint-disable */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const SolverState_1 = require('./SolverState');
const Ship_1 = require('./Ship');
const reducer = transactions => (acc, planet, index) => {
  const transaction = transactions.find(
    ({ planetIndex }) => planetIndex === index + 1
  );
  if (transaction === undefined) {
    return acc;
  }
  if (acc.errors.length > 0) {
    return acc;
  }
  const deltaContraband =
    transaction.deltaContraband === undefined ? 0 : transaction.deltaContraband;
  const errors = [];
  if (acc.cargoHold.water + transaction.deltaWater < 0) {
    errors.push(
      `Sold more water than in cargo hold at planet ${transaction.planetIndex}`
    );
  }
  if (acc.cargoHold.ore + transaction.deltaOre < 0) {
    errors.push(
      `Sold more ore than in cargo hold at planet ${transaction.planetIndex}`
    );
  }
  if (acc.cargoHold.engineParts + transaction.deltaEngineParts < 0) {
    errors.push(
      `Sold more engine parts than in cargo hold at planet ${
        transaction.planetIndex
      }`
    );
  }
  if (acc.cargoHold.contraband + deltaContraband < 0) {
    errors.push(
      `Sold more contraband than in cargo hold at planet ${
        transaction.planetIndex
      }`
    );
  }
  if (planet.faction === 'Liberty' && acc.cargoHold.contraband > 0) {
    errors.push(
      `Arrived at a Liberty planet (index ${
        transaction.planetIndex
      }) with contraband`
    );
  }
  const deltaMoneyTrade =
    planet.waterPrice * -transaction.deltaWater +
    planet.orePrice * -transaction.deltaOre +
    planet.partsPrice * -transaction.deltaEngineParts +
    planet.contrabandPrice * -deltaContraband;
  const deltaMoneyShipPurchase =
    transaction.shipPurchase === undefined
      ? 0
      : -Ship_1.ships[transaction.shipPurchase].price;
  const money = acc.money + deltaMoneyTrade + deltaMoneyShipPurchase;
  if (money < 0) {
    errors.push(
      `Negative account balance at planet ${transaction.planetIndex}`
    );
  }
  const cargoHold = {
    water: acc.cargoHold.water + transaction.deltaWater,
    ore: acc.cargoHold.ore + transaction.deltaOre,
    engineParts: acc.cargoHold.engineParts + transaction.deltaEngineParts,
    contraband: acc.cargoHold.contraband + deltaContraband,
  };
  const ship =
    transaction.shipPurchase === undefined
      ? acc.ship
      : Ship_1.ships[transaction.shipPurchase];
  if (
    cargoHold.water +
      cargoHold.ore +
      cargoHold.engineParts +
      cargoHold.contraband >
    ship.cargoHoldSize
  ) {
    errors.push(
      `Maximum capacity exceeded at planet ${transaction.planetIndex}`
    );
  }
  return {
    cargoHold,
    money,
    ship,
    errors,
  };
};
function check(planets, transactions) {
  const solverStateAtLastPlanet = planets.reduce(
    reducer(transactions),
    SolverState_1.initialSolverState
  );
  const finalTrade = {
    planetIndex: planets.length,
    deltaWater: -solverStateAtLastPlanet.cargoHold.water,
    deltaOre: -solverStateAtLastPlanet.cargoHold.ore,
    deltaEngineParts: -solverStateAtLastPlanet.cargoHold.engineParts,
    deltaContraband: -solverStateAtLastPlanet.cargoHold.contraband,
  };
  return reducer([finalTrade])(
    solverStateAtLastPlanet,
    planets[planets.length - 1],
    planets.length - 1
  );
}
exports.check = check;
