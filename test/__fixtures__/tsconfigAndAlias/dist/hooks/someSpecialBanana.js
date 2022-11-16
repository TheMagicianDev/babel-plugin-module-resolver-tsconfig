"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSpecialBanana = useSpecialBanana;
function useSpecialBanana(energy) {
  if (energy < 3) {
    return {
      should: true,
      size: 8
    };
  }
  if (energy < 5) {
    return {
      should: true,
      size: 5
    };
  }
  return {
    should: false,
    size: 0
  };
}