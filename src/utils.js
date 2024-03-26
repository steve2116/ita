// Game information

const airBaseInfo = {
  energyCost: 20,
  energyBaseGain: 1,
  energyGainPerLevel: 1,
  softcap: 100,
  timePerProgress: 2000,
};
const floraBaseInfo = {
  energyCost: 1000,
  energyBaseGain: 200,
  energyGainPerLevel: 45,
  softcap: 50,
  timePerProgress: 120000,
};
const rodentBaseInfo = {
  energyCost: 1000000,
  energyBaseGain: 10000,
  energyGainPerLevel: 20000,
  massCost: 0,
  massBaseGain: 1,
  massGainPerLevel: 0.1,
  softcap: 10,
  timePerProgress: 600000,
};
const informationClassChecker =
  "jsadhasdjhqwiuadgnakuysdbgauishndgcuashdgnauydgs";

// Functions for use in the game

/**
 * @returns {{
 *  energyCost: number;
 *  energyBaseGain: number;
 *  energyGainPerLevel: number;
 *  timePerProgress: number;
 *  func: (refs: {
 *      energy: {current: number, add: (vals: {gain: number, loss: number}) => void},
 *      air: {current: number, add: (vals: {gain: number, loss: number}) => void}
 *    }) => void;
 * }} An object containing info about [ Air ] and the function to run each tick - Each value in func should have a getter `get current()` and setter `set current()` and a function to increment the value `add(vals: {gain: number, loss: number})`
 */
function airTick(
  /** @type {Information} */
  getInfo
) {
  const { energyBaseGain, energyGainPerLevel } = airBaseInfo;
  const { energy: energyCost } = getInfo.airCost;
  const timePerProgress = getInfo.airTime;
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
          const { current, add } = refs[key];
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

    const { energy: energyGain } = getInfo.airGain;

    energy.add({ gain: energyGain, loss: energyCost });
    air.add({ gain: 1 });
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
 *  energyCost: number;
 *  energyBaseGain: number;
 *  energyGainPerLevel: number;
 *  timePerProgress: number;
 *  func: (refs: {
 *    energy: {current: number, add: (vals: {gain: number, loss: number}) => void},
 *    flora: {current: number, add: (vals: {gain: number, loss: number}) => void}}
 *   ) => void;
 * }} An object containing info about [ Flora ] and the function to run each tick - Each value in func should have a getter `get current()` and setter `set current()` and a function to increment the value `add(vals: {gain: number, loss: number})`
 */
function floraTick(
  /** @type {Information} */
  getInfo
) {
  const { energyBaseGain, energyGainPerLevel } = floraBaseInfo;
  const { energy: energyCost } = getInfo.floraCost;
  const timePerProgress = getInfo.floraTime;
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
          const { current, add } = refs[key];
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
    const { energy: energyGain } = getInfo.floraGain;
    energy.add({ gain: energyGain, loss: energyCost });
    flora.add({ gain: 1 });
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
 * func: ({energy: {current: number, add: (vals: {gain: number, loss: number}) => void}, mass: {current: number, add: (vals: {gain: number, loss: number}) => void}, rodent: {current: number, add: (vals: {gain: number, loss: number}) => void}}) => void;
 * }} - An object containing info about [ Rodent ] and the function to run each tick - Each value in func should have a getter `get current()` and setter `set current()` and a function to increment the value `add(vals: {gain: number, loss: number})`
 */
function rodentTick(
  /** @type {Information} */
  getInfo
) {
  const { energyBaseGain, energyGainPerLevel, massBaseGain, massGainPerLevel } =
    rodentBaseInfo;
  const { energy: energyCost, mass: massCost } = getInfo.rodentCost;
  const timePerProgress = getInfo.rodentTime;
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
          const { current, add } = refs[key];
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
    const { energy: energyGain, mass: massGain } = getInfo.rodentGain;
    energy.add({ gain: energyGain, loss: energyCost });
    mass.add({ gain: massGain, loss: massCost });
    rodent.add({ gain: 1 });
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

/** A class to retrieve information */
class Information {
  /**
   * An object of resource getters
   * @type {{energy: number; mass: number;}}
   */
  resources = { energy: 0, mass: 0 };
  /**
   * An object of skill getters
   * @type {{air: number; flora: number; rodent: number;}}
   */
  skills = { air: 0, flora: 0, rodent: 0 };
  /**
   * An object of evolution getters
   * @type {{items: string[];}}
   */
  evolutions = { items: [] };
  /**
   * @param {{energy: number; mass: number;}} resources - An object ref containing the current amount of resources
   * @param {{air: number; flora: number; rodent: number;}} skills - An object ref containing the current level of skills
   * @param {{items: string[];}} evolutions - An object ref containing information on evolutions
   */
  constructor(resources, skills, evolutions) {
    try {
      this.resources = resources;
      Object.values(this.resources).forEach((resource) => {
        if (typeof resource !== "number") throw new Error();
      });
    } catch (e) {
      console.log(e);
      console.error("Utils.js > Information: Incorrect resources object");
    }
    try {
      this.skills = skills;
      Object.values(this.skills).forEach((skill) => {
        if (typeof skill !== "number") throw new Error();
      });
    } catch (e) {
      console.error("Utils.js > Information: Incorrect skills object");
    }
    try {
      this.evolutions = evolutions;
      this.evolutions.items.forEach((evolution) => {
        if (typeof evolution !== "string") throw new Error();
      });
    } catch (e) {
      console.error("Utils.js > Information: Incorrect evolutions object");
    }
  }
  get check() {
    return informationClassChecker;
  }

  get energyClick() {
    let energyGain = 1;
    if (this.evolutions.items.includes("exist-1")) {
      const { air, flora, rodent } = this.skills;
      energyGain *=
        Math.min(this.airSoftCap, air) * 0.01 +
        this.airCap({
          energy: Math.max(this.airSoftCap - air, 0),
        }).energy *
          0.01;
      energyGain *=
        Math.min(this.floraSoftCap, flora) * 0.75 +
        this.floraCap({
          energy: Math.max(this.floraSoftCap - flora, 0),
        }).energy *
          0.75;
      energyGain *=
        Math.min(this.rodentSoftCap, rodent) * 5 +
        this.rodentCap({
          energy: Math.max(this.rodentSoftCap - rodent, 0),
        }).energy *
          5;
    }
    return Math.floor(energyGain);
  }

  get airCost() {
    let energy = airBaseInfo.energyCost;
    if (this.evolutions.items.includes("lungs-1")) {
      energy -= 2;
    }
    if (this.evolutions.items.includes("lungs-2")) {
      energy -= 3;
    }
    if (this.evolutions.items.includes("lungs-3")) {
      energy -= 3;
    }
    return { energy };
  }

  get airMulti() {
    let multi = 1;
    if (this.evolutions.items.includes("lungs-1")) {
      multi += 0.1;
    }
    if (this.evolutions.items.includes("lungs-2")) {
      multi += 0.3;
    }
    if (this.evolutions.items.includes("lungs-3")) {
      multi += 0.5;
    }
    if (this.evolutions.items.includes("lungs-4")) {
      multi += 0.75;
    }
    if (this.evolutions.items.includes("lungs-5")) {
      multi += 1.25;
    }
    if (this.evolutions.items.includes("lungs-6")) {
      multi += 2;
    }
    if (this.evolutions.items.includes("lungs-7")) {
      multi += 3;
    }

    if (this.evolutions.items.includes("mouth-1")) {
      multi *= 1.1;
    }
    return multi;
  }

  get airSoftCap() {
    let softcap = airBaseInfo.softcap;
    if (this.evolutions.items.includes("lungs-4")) {
      softcap *= 1.2;
    }
    if (this.evolutions.items.includes("lungs-5")) {
      softcap *= 2;
    }
    if (this.evolutions.items.includes("lungs-7")) {
      softcap *= 2.5;
    }
    if (this.evolutions.items.includes("nose-4")) {
      softcap *= 1.25;
    }
    if (this.evolutions.items.includes("nose-5")) {
      softcap *= 1.3;
    }
    if (this.evolutions.items.includes("mouth-1")) {
      softcap *= 1.5;
    }
    return softcap;
  }

  airCap({ energy }) {
    let exp = 0.5;
    if (this.evolutions.items.includes("lungs-6")) {
      exp += 0.02;
    }
    if (this.evolutions.items.includes("lungs-7")) {
      exp += 0.03;
    }
    return { energy: Math.floor(energy ** exp / 2) };
  }

  get airTime() {
    return airBaseInfo.timePerProgress;
  }

  get airGain() {
    const { air } = this.skills;
    const multi = this.airMulti;
    const softcap = this.airSoftCap;
    const { energy } = this.airCap({
      energy: multi * Math.max(air - softcap, 0),
    });
    return {
      energy: Math.floor(
        airBaseInfo.energyBaseGain +
          airBaseInfo.energyGainPerLevel *
            (multi * Math.min(softcap - 1, air - 1) + energy)
      ),
    };
  }

  get airInfo() {
    return {
      cost: this.airCost,
      multi: this.airMulti,
      softcap: this.airSoftCap,
      gain: this.airGain,
      time: this.airTime,
    };
  }

  get floraCost() {
    let energy = floraBaseInfo.energyCost;
    if (this.evolutions.items.includes("nose-1")) {
      energy -= 150;
    }
    if (this.evolutions.items.includes("nose-2")) {
      energy -= 200;
    }
    if (this.evolutions.items.includes("nose-3")) {
      energy -= 250;
    }
    return { energy };
  }

  get floraMulti() {
    let multi = 1;
    if (this.evolutions.items.includes("nose-1")) {
      multi += 0.2;
    }
    if (this.evolutions.items.includes("nose-2")) {
      multi += 0.5;
    }
    if (this.evolutions.items.includes("nose-3")) {
      multi += 0.9;
    }
    if (this.evolutions.items.includes("nose-4")) {
      multi += 1.5;
    }
    if (this.evolutions.items.includes("nose-5")) {
      multi += 2.2;
    }

    if (this.evolutions.items.includes("mouth-1")) {
      multi *= 1.1;
    }
    return multi;
  }

  get floraSoftCap() {
    let softcap = floraBaseInfo.softcap;
    return softcap;
  }

  floraCap({ energy }) {
    return { energy: Math.floor(energy ** 0.5 / 2) };
  }

  get floraTime() {
    return floraBaseInfo.timePerProgress;
  }

  get floraGain() {
    const { flora } = this.skills;
    const multi = this.floraMulti;
    const softcap = this.floraSoftCap;
    const { energy } = this.floraCap({
      energy: multi * Math.max(flora - softcap, 0),
    });
    return {
      energy: Math.floor(
        floraBaseInfo.energyBaseGain +
          floraBaseInfo.energyGainPerLevel *
            (multi * Math.min(softcap - 1, flora - 1) + energy)
      ),
    };
  }

  get floraInfo() {
    return {
      cost: this.floraCost,
      multi: this.floraMulti,
      softcap: this.floraSoftCap,
      gain: this.floraGain,
      time: this.floraTime,
    };
  }

  get rodentCost() {
    let energy = rodentBaseInfo.energyCost;
    let mass = rodentBaseInfo.massCost;
    if (this.evolutions.items.includes("claws-1")) {
      energy -= 50000;
    }
    if (this.evolutions.items.includes("claws-2")) {
      energy -= 50000;
    }
    return { energy, mass };
  }

  get rodentMulti() {
    let multi = 1;
    if (this.evolutions.items.includes("claws-1")) {
      multi += 0.1;
    }
    if (this.evolutions.items.includes("claws-2")) {
      multi += 0.2;
    }
    return multi;
  }

  get rodentSoftCap() {
    let softcap = rodentBaseInfo.softcap;
    return softcap;
  }

  rodentCap({ energy, mass }) {
    return {
      energy: Math.floor(energy ** 0.5 / 2),
      mass: Math.floor(mass ** 0.5 / 2),
    };
  }

  get rodentTime() {
    return rodentBaseInfo.timePerProgress;
  }

  get rodentGain() {
    const { rodent } = this.skills;
    const multi = this.rodentMulti;
    const softcap = this.rodentSoftCap;
    const { energy, mass } = this.rodentCap({
      energy: Math.max(rodent - softcap, 0),
      mass: Math.max(rodent - softcap, 0),
    });
    return {
      energy: Math.floor(
        rodentBaseInfo.energyBaseGain +
          rodentBaseInfo.energyGainPerLevel *
            (multi * Math.min(softcap - 1, rodent - 1) + energy)
      ),
      mass:
        Math.floor(
          (rodentBaseInfo.massBaseGain +
            rodentBaseInfo.massGainPerLevel *
              (multi * (Math.min(softcap - 1, rodent - 1) + mass))) *
            100
        ) / 100,
    };
  }

  get rodentInfo() {
    return {
      cost: this.rodentCost,
      multi: this.rodentMulti,
      softcap: this.rodentSoftCap,
      gain: this.rodentGain,
      time: this.rodentTime,
    };
  }
}

export { Information };

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
  if (days > 0) result += `${numberAsReadable(days)}d `;
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
  const [beforeDecimal, afterDecimal] = (Math.round(num * 100) / 100)
    .toString()
    .split(".");
  return (
    beforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (afterDecimal ? `.${afterDecimal}` : "")
  );
}

export { secondsAsReadable, numberAsReadable };
