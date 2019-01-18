/* eslint-disable */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const CargoHold_1 = require('./CargoHold');
const Ship_1 = require('./Ship');
exports.initialSolverState = {
  money: 0,
  ship: Ship_1.ships.Default,
  cargoHold: CargoHold_1.initialCargoHold,
  errors: [],
};
