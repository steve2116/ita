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
  softcap: 100,
  timePerProgress: 120000,
};
const rodentBaseInfo = {
  energyCost: 1000000,
  energyBaseGain: 10000,
  energyGainPerLevel: 20000,
  massCost: 0,
  massBaseGain: 1,
  massGainPerLevel: 0.1,
  softcap: 100,
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
 *      energy: {current: number, next: (val: number | (current: number) => number) => void},
 *      air: {current: number, next: (val: number | (current: number) => number) => void}
 *    }) => void;
 * }} An object containing info about [ Air ] and the function to run each tick - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function airTick(
  /** @type {Information} */
  getInfo
) {
  const { energyBaseGain, energyGainPerLevel, timePerProgress } = airBaseInfo;
  const { energyCost } = getInfo.airCost;
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
    const beforeSoftcap = Math.min(getInfo.airSoftCap, air.current);
    const afterSoftcap = air.current - beforeSoftcap;
    const beforeGain = getInfo.airMulti * (beforeSoftcap - 1);
    const afterGain = getInfo.airCap({
      energy: getInfo.airMulti * afterSoftcap,
    }).energy;

    energy.next(
      (curr) =>
        curr +
        Math.floor(
          energyBaseGain + energyGainPerLevel * (beforeGain + afterGain)
        ) -
        energyCost
    );
    air.next((curr) => curr + 1);
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
 *    energy: {current: number, next: (val: number | (current: number) => number) => void},
 *    flora: {current: number, next: (val: number | (current: number) => number) => void}}
 *   ) => void;
 * }} An object containing info about [ Flora ] and the function to run each tick - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function floraTick(
  /** @type {Information} */
  getInfo
) {
  const { energyBaseGain, energyGainPerLevel, timePerProgress } = floraBaseInfo;
  const { energyCost } = getInfo.floraCost;
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
    const beforeGain = getInfo.floraMulti * (beforeSoftcap - 1);
    const afterGain = getInfo.floraCap({
      energy: getInfo.floraMulti * afterSoftcap,
    }).energy;
    energy.next(
      (curr) =>
        curr +
        Math.floor(
          energyBaseGain + energyGainPerLevel * (beforeGain + afterGain)
        ) -
        energyCost
    );
    flora.next((curr) => curr + 1);
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
 * func: ({energy: {current: number, next: (val: number | (current: number) => number) => void}, mass: {current: number, next: (val: number | (current: number) => number) => void}, rodent: {current: number, next: (val: number | (current: number) => number) => void}}) => void;
 * }} - An object containing info about [ Rodent ] and the function to run each tick.
 * - Each value in func should have a getter `get current()` and a function to change the value `next(val: number)`
 */
function rodentTick(
  /** @type {Information} */
  getInfo
) {
  const {
    energyBaseGain,
    energyGainPerLevel,
    massBaseGain,
    massGainPerLevel,
    timePerProgress,
  } = rodentBaseInfo;
  const { energyCost, massCost } = getInfo.rodentCost;
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
    const beforeGain = getInfo.rodentMulti * (beforeSoftcap - 1);
    const afterGain = getInfo.rodentCap({
      energy: getInfo.rodentMulti * afterSoftcap,
      mass: getInfo.rodentMulti * afterSoftcap,
    });
    energy.next(
      (curr) =>
        curr +
        Math.floor(
          energyBaseGain + energyGainPerLevel * (beforeGain + afterGain.energy)
        ) -
        energyCost
    );
    mass.next(
      (curr) =>
        curr +
        massBaseGain +
        massGainPerLevel * (beforeGain + afterGain.mass) -
        massCost
    );
    rodent.next((curr) => curr + 1);
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
   * @type {{air: {current: number}; flora: {current: number}; rodent: {current: number};}}
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
        Math.min(this.airSoftCap, air) * 0.005 +
        this.airCap({
          energy: Math.max(this.airSoftCap - air, 0) * 0.005,
        }).energy;
      energyGain *=
        Math.min(this.floraSoftCap, flora) +
        this.floraCap({
          energy: Math.max(this.floraSoftCap - flora, 0),
        }).energy;
      energyGain *=
        Math.min(this.rodentSoftCap, rodent) * 10 +
        this.rodentCap({
          energy: Math.max(this.rodentSoftCap - rodent, 0) * 10,
        }).energy;
    }
    return Math.floor(energyGain);
  }

  get airCost() {
    let energyCost = airBaseInfo.energyCost;
    if (this.evolutions.items.includes("lungs-1")) {
      energyCost -= 2;
    }
    if (this.evolutions.items.includes("lungs-2")) {
      energyCost -= 3;
    }
    if (this.evolutions.items.includes("lungs-3")) {
      energyCost -= 3;
    }
    return { energyCost };
  }

  get airMulti() {
    let multi = 1;
    if (this.evolutions.items.includes("lungs-1")) {
      multi += 0.5;
    }
    if (this.evolutions.items.includes("lungs-2")) {
      multi += 1;
    }
    if (this.evolutions.items.includes("lungs-3")) {
      multi += 1.5;
    }
    if (this.evolutions.items.includes("lungs-4")) {
      multi += 2;
    }
    if (this.evolutions.items.includes("lungs-5")) {
      multi += 3;
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
    return softcap;
  }

  airCap({ energy }) {
    return { energy: Math.floor(energy ** 0.5 / 2) };
  }

  get floraCost() {
    let energyCost = floraBaseInfo.energyCost;
    if (this.evolutions.items.includes("nose-1")) {
      energyCost -= 150;
    }
    if (this.evolutions.items.includes("nose-2")) {
      energyCost -= 200;
    }
    if (this.evolutions.items.includes("nose-3")) {
      energyCost -= 250;
    }
    return { energyCost };
  }

  get floraMulti() {
    let multi = 1;
    if (this.evolutions.items.includes("nose-1")) {
      multi += 0.5;
    }
    if (this.evolutions.items.includes("nose-2")) {
      multi += 1;
    }
    if (this.evolutions.items.includes("nose-3")) {
      multi += 1.5;
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

  get rodentCost() {
    let energyCost = rodentBaseInfo.energyCost;
    let massCost = rodentBaseInfo.massCost;
    return { energyCost, massCost };
  }

  get rodentMulti() {
    let multi = 1;
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
