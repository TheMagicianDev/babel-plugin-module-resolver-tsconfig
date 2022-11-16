export function useSpecialBanana(energy: number): any {
  if (energy < 3) {
    return {
      should: true,
      size: 8,
    };
  }
  if (energy < 5) {
    return {
      should: true,
      size: 5,
    };
  }
  return {
    should: false,
    size: 0,
  };
}
