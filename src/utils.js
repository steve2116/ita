// Functions for use in the game

/**
 * @returns {{
 * energyCost: number;
 * energyBaseGain: number;
 * energyGainPerLevel: number;
 * timePerProgress: number;
 * func: ({energy: {current: number, next: (val: number) => void}, air: {current: number, next: (val: number) => void}}) => void;
 * }} - An object containing info about [ Air ] and the function to run each tick
 * - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function airTick() {
  const energyCost = 20,
    energyBaseGain = 1,
    energyGainPerLevel = 1,
    timePerProgress = 2000;
  function func(refs) {
    const argNames = ["energy", "air"];
    if (
      !argNames.every((key) => Object.prototype.hasOwnProperty.call(refs, key))
    ) {
      console.error("Utils.js > airTick: Insufficient args");
      return;
    }
    if (
      !argNames.every((key) => {
        try {
          const { current, next } = refs[key];
          return true;
        } catch (e) {
          return false;
        }
      })
    ) {
      console.error("Utils.js > airTick: Incorrect args");
      return;
    }
    const { energy, air } = refs;
    const beforeSoftcap = Math.min(100, air.current);
    const afterSoftcap = air.current - beforeSoftcap;
    energy.next(
      energy.current +
        energyBaseGain +
        energyGainPerLevel *
          (beforeSoftcap - 1 + Math.floor(Math.sqrt(afterSoftcap / 2))) -
        energyCost
    );
    air.next(air.current + 1);
  }
  return {
    energyCost,
    energyBaseGain,
    energyGainPerLevel,
    timePerProgress,
    func,
  };
}

/**
 * @returns {{
 * energyCost: number;
 * energyBaseGain: number;
 * energyGainPerLevel: number;
 * timePerProgress: number;
 * func: ({energy: {current: number, next: (val: number) => void}, flora: {current: number, next: (val: number) => void}}) => void;
 * }} - An object containing info about [ Flora ] and the function to run each tick.
 * - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function floraTick() {
  const energyCost = 1000,
    energyBaseGain = 200,
    energyGainPerLevel = 45,
    timePerProgress = 120000;
  function func(refs) {
    const argNames = ["energy", "flora"];
    if (
      !argNames.every((key) => Object.prototype.hasOwnProperty.call(refs, key))
    ) {
      console.error("Utils.js > floraTick: Insufficient args");
      return;
    }
    if (
      !argNames.every((key) => {
        try {
          const { current, next } = refs[key];
          return true;
        } catch (e) {
          return false;
        }
      })
    ) {
      console.error("Utils.js > floraTick: Incorrect args");
      return;
    }
    const { energy, flora } = refs;
    const beforeSoftcap = Math.min(100, flora.current);
    const afterSoftcap = flora.current - beforeSoftcap;
    energy.next(
      energy.current +
        energyBaseGain +
        energyGainPerLevel *
          (beforeSoftcap - 1 + Math.floor(Math.sqrt(afterSoftcap / 2))) -
        energyCost
    );
    flora.next(flora.current + 1);
  }
  return {
    energyCost,
    energyBaseGain,
    energyGainPerLevel,
    timePerProgress,
    func,
  };
}

/**
 * @returns {{
 * energyCost: number;
 * energyBaseGain: number;
 * energyGainPerLevel: number;
 * massCost: number;
 * massBaseGain: number;
 * massGainPerLevel: number;
 * timePerProgress: number;
 * func: ({energy: {current: number, next: (val: number) => void}, mass: {current: number, next: (val: number) => void}, rodent: {current: number, next: (val: number) => void}}) => void;
 * }} - An object containing info about [ Rodent ] and the function to run each tick.
 * - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function rodentTick() {
  const energyCost = 1000000,
    energyBaseGain = 10000,
    energyGainPerLevel = 20000,
    massCost = 0,
    massBaseGain = 1,
    massGainPerLevel = 0.1,
    timePerProgress = 600000;
  function func(refs) {
    const argNames = ["energy", "mass", "rodent"];
    if (
      !argNames.every((key) => Object.prototype.hasOwnProperty.call(refs, key))
    ) {
      console.error("Utils.js > rodentTick: Insufficient args");
      return;
    }
    if (
      !argNames.every((key) => {
        try {
          const { current, next } = refs[key];
          return true;
        } catch (e) {
          return false;
        }
      })
    ) {
      console.error("Utils.js > rodentTick: Incorrect args");
      return;
    }
    const { energy, mass, rodent } = refs;
    const beforeSoftcap = Math.min(100, rodent.current);
    const afterSoftcap = rodent.current - beforeSoftcap;
    energy.next(
      energy.current +
        energyBaseGain +
        energyGainPerLevel *
          (beforeSoftcap - 1 + Math.floor(Math.sqrt(afterSoftcap / 2))) -
        energyCost
    );
    mass.next(
      mass.current +
        massBaseGain +
        massGainPerLevel *
          (beforeSoftcap - 1 + Math.floor(Math.sqrt(afterSoftcap / 2))) -
        massCost
    );
    rodent.next(rodent.current + 1);
  }
  return {
    energyCost,
    energyBaseGain,
    energyGainPerLevel,
    massCost,
    massBaseGain,
    massGainPerLevel,
    timePerProgress,
    func,
  };
}

export { airTick, floraTick, rodentTick };

// Functions for various uses

function secondsAsReadable(time, round = "s") {
  if (typeof time != "number") return "NaN";
  let seconds = time;
  const days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  switch (round) {
    case "1":
    case "d":
      if (time >= 86400) hours = 0;
    case "h":
      if (time >= 3600) minutes = 0;
    case "m":
      if (time >= 60) seconds = 0;
      break;
    case "2":
      if (time >= 86400) minutes = 0;
      if (time >= 3600) seconds = 0;
      break;
    case "3":
      if (time >= 86400) seconds = 0;
      break;
  }
  let result = "";
  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0) result += `${seconds}s `;
  return result.trimEnd();
}

function numberAsReadable(num) {
  if (typeof num !== "number") {
    console.error("Util.js > numberAsReadable: Only accept Number() types");
    return num;
  }
  const [beforeDecimal, afterDecimal] = num.toString().split(".");
  return (
    beforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (afterDecimal ? `.${afterDecimal}` : "")
  );
}

export { secondsAsReadable, numberAsReadable };
