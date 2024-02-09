<template>
  <div id="div-to-fix-stupid-css-styles">
    <header>
      <h1>Increase The Amount!</h1>
    </header>
    <nav>
      <button
        :class="navButtonStyle"
        @click="tab = 'game'"
      >
        Game
      </button>
      <button
        :class="navButtonStyle"
        @click="tab = 'settings'"
      >
        Settings
      </button>
      <button
        :class="navButtonStyle"
        @click="tab = 'credits-info'"
      >
        Credits & Info
      </button>
    </nav>
    <main>
      <template v-if="tab === 'game'"
        ><Gamet
          :theme="theme"
          :onTickRef="tick.onTickFuncs"
          :gameData="gameData"
      /></template>
      <template v-else-if="tab === 'settings'">
        <Settingst
          :theme="theme"
          :secondsUntilSave="generalData.secondsUntilSave"
          :initial-tick-rate="tick.tickRate"
          :initial-version="generalData.version"
          @manual-save="saveGame"
          @change-theme="() => $emit('changeTheme')"
          @change-tick-speed="changeTickSpeed"
          @cheat-energy="
            () => {
              gameData.resources.energy *= 2;
            }
          "
          @change-version="changeVersionEmit"
        />
      </template>
      <template v-else-if="tab === 'credits-info'"
        ><p>Me ( github.com/steve2116 )</p></template
      >
      <template v-else>How... nevermind, please report a bug</template>
    </main>
  </div>
</template>

<script>
import Gamet from "./Game/tGame.vue";
import Settingst from "./Game/tSettings.vue";

import CryptoJS from "crypto-js";

export default {
  name: "Game",
  components: {
    Settingst,
    Gamet,
  },
  props: {
    theme: {
      type: String,
      required: true,
    },
    initialGameData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: "game",
      /**
       * @type {Record<string, number>}
       */
      timers: {},
      generalData: {
        secondsUntilSave: 150,
        savingIntervalInSeconds: 300,
      },
      tick: {
        tickRateMin: 50,
        /**
         * @type {Record<string, {func: (tickRate: number, deleteFunc: () => void, nameOfFunc: string) => void, progress: number}>}
         */
        onTickFuncs: {},
        onTick() {
          const { tickRate, onTickFuncs } = this;
          Object.entries(this.onTickFuncs).forEach(([key, funcData]) =>
            funcData.func(tickRate, () => delete onTickFuncs[key], key)
          );
        },
      },
      gameData: {},
    };
  },
  mounted() {
    const onLoadTimer = setInterval(() => {
      if (typeof this.initialGameData.generalData.new === "boolean") {
        const { generalData, tick, gameData } = this.initialGameData;
        const { skillTicks, ...otherGameData } = gameData;
        clearInterval(onLoadTimer);
        this.generalData = { ...generalData, ...this.generalData };
        this.tick = { ...tick, ...this.tick };
        this.gameData = { ...otherGameData };
        this.timers.tick = setInterval(() => {
          this.tick.onTick();
        }, this.tick.tickRate);
        this.timers.save = setInterval(() => {
          this.generalData.secondsUntilSave -= 1;
          if (this.generalData.secondsUntilSave <= 0) this.saveGame();
        }, 1000);
        this.addMilestones(skillTicks);
      }
    }, 100);
  },
  unmounted() {
    Object.values(this.timers).forEach((timer) => clearInterval(timer));
  },
  computed: {
    navButtonStyle() {
      return {
        "nav-button": true,
        "light-button-1": this.theme === "light",
        "dark-button-1": this.theme === "dark",
      };
    },
  },
  methods: {
    getSaveData() {
      const encrypt = (text) => {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      };
      switch (this.generalData.version) {
        case "0.0.3": {
          let skillTicks = {};
          ["air", "flora", "rodent"].forEach((skill) => {
            try {
              skillTicks[skill] = this.tick.onTickFuncs[skill].progress;
            } catch (e) {
              skillTicks[skill] = 0;
            }
          });
          return encrypt(
            JSON.stringify({
              version: "0.0.3",
              theme: this.theme,
              tick: {
                tickRate: this.tick.tickRate,
              },
              gameData: {
                resources: {
                  energy: this.gameData.resources.energy,
                  mass: this.gameData.resources.mass,
                },
                skills: {
                  air: this.gameData.skills.air,
                  flora: this.gameData.skills.flora,
                  rodent: this.gameData.skills.rodent,
                },
                skillTicks,
              },
            })
          );
        }
        case "0.0.2": {
          return encrypt(
            JSON.stringify({
              version: "0.0.2",
              theme: this.theme,
              tick: {
                tickRate: this.tick.tickRate,
              },
              gameData: {
                resources: {
                  energy: this.gameData.resources.energy,
                  mass: this.gameData.resources.mass,
                },
                skills: {
                  air: this.gameData.skills.air,
                  flora: this.gameData.skills.flora,
                  rodent: this.gameData.skills.rodent,
                },
              },
            })
          );
        }
        case "0.0.1": {
          return encrypt(
            JSON.stringify({
              version: "0.0.1",
              theme: this.theme,
            })
          );
        }
      }
    },
    saveGame() {
      this.generalData.secondsUntilSave =
        this.generalData.savingIntervalInSeconds;
      localStorage.setItem("ita-data", this.getSaveData());
    },
    changeTickSpeed(newTickSpeed) {
      if (!this.tick.onTickFuncs.newTickRate) {
        const newTickRate = parseInt(newTickSpeed, 10);
        if (!isNaN(newTickRate)) {
          const { tick, timers } = this;
          tick.onTickFuncs.newTickRate = {
            func(tickRate, deleteFunc) {
              deleteFunc();
              tick.tickRate = Math.max(tick.tickRateMin, newTickRate);
              clearInterval(timers.tick);
              timers.tick = setInterval(() => {
                tick.onTick();
              }, tick.tickRate);
            },
            progress: 0,
          };
        }
      }
    },
    addMilestones(skillTicks) {
      const { skills, resources } = this.gameData;
      const { onTickFuncs } = this.tick;
      onTickFuncs.unlockAir = {
        func(tickRate, deleteFunc) {
          if (skills.air >= 0 || resources.energy >= 10) {
            deleteFunc();
            skills.air = Math.max(0, skills.air);
            if (skills.air > 0) {
              onTickFuncs.air = {
                func(tickRate) {
                  const energyCost = 20;
                  if (resources.energy >= energyCost) {
                    this.progress += tickRate;
                    if (this.progress >= 2000) {
                      const energyBaseGain = 1;
                      const energyGainPerLevel = 1;
                      const beforeSoftcap = Math.min(100, skills.air);
                      const afterSoftcap = skills.air - beforeSoftcap;
                      resources.energy +=
                        energyBaseGain +
                        energyGainPerLevel *
                          (beforeSoftcap -
                            1 +
                            Math.floor(Math.sqrt(afterSoftcap / 2))) -
                        energyCost;
                      skills.air++;
                      this.progress -= 2000;
                    }
                  } else if (this.progress < 2000) this.progress += tickRate;
                },
                progress: Math.floor(skillTicks.air / tickRate) * tickRate,
              };
            }
          }
        },
        progress: 0,
      };
      onTickFuncs.unlockFlora = {
        func(tickRate, deleteFunc) {
          if (skills.flora >= 0 || resources.energy >= 1000) {
            deleteFunc();
            skills.flora = Math.max(0, skills.flora);
            if (skills.air > 0) {
              onTickFuncs.flora = {
                func(tickRate) {
                  const energyCost = 1000;
                  if (resources.energy >= energyCost) {
                    this.progress += tickRate;
                    if (this.progress >= 120000) {
                      const energyBaseGain = 200;
                      const energyGainPerLevel = 45;
                      const beforeSoftcap = Math.min(100, skills.flora);
                      const afterSoftcap = skills.flora - beforeSoftcap;
                      resources.energy +=
                        energyBaseGain +
                        energyGainPerLevel *
                          (beforeSoftcap -
                            1 +
                            Math.floor(Math.sqrt(afterSoftcap / 2))) -
                        energyCost;
                      skills.flora++;
                      this.progress -= 120000;
                    }
                  } else if (this.progress < 120000) this.progress += tickRate;
                },
                progress: Math.floor(skillTicks.flora / tickRate) * tickRate,
              };
            }
          }
        },
        progress: 0,
      };
      onTickFuncs.unlockRodent = {
        func(tickRate, deleteFunc) {
          if (skills.rodent >= 0 || resources.energy >= 100000) {
            deleteFunc();
            skills.rodent = Math.max(0, skills.rodent);
            if (skills.rodent > 0) {
              onTickFuncs.rodent = {
                func(tickRate) {
                  const energyCost = 1000000;
                  if (resources.energy >= energyCost) {
                    this.progress += tickRate;
                    if (this.progress >= 600000) {
                      const energyBaseGain = 10000;
                      const energyGainPerLevel = 20000;
                      const massBaseGain = 1;
                      const massGainPerLevel = 0.1;
                      const beforeSoftcap = Math.min(100, skills.rodent);
                      const afterSoftcap = skills.rodent - beforeSoftcap;
                      resources.energy +=
                        energyBaseGain +
                        energyGainPerLevel * (beforeSoftcap - 1) +
                        energyGainPerLevel *
                          Math.floor(Math.sqrt(afterSoftcap / 2)) -
                        energyCost;
                      resources.mass +=
                        massBaseGain +
                        Math.floor(
                          massGainPerLevel *
                            (beforeSoftcap -
                              1 +
                              Math.floor(Math.sqrt(afterSoftcap / 2)))
                        );
                      skills.rodent++;
                      this.progress -= 600000;
                    }
                  } else if (this.progress < 600000) this.progress += tickRate;
                },
                progress: Math.floor(skillTicks.rodent / tickRate) * tickRate,
              };
            }
          }
        },
        progress: 0,
      };
    },
    changeVersionEmit(newVersion) {
      this.generalData.version = newVersion;
      this.saveGame();
      window.location.reload();
    },
  },
  emits: ["changeTheme"],
};
</script>

<style scoped>
#div-to-fix-stupid-css-styles {
  width: 100%;
  height: 100%;
  min-height: max(
    var(--height-of-game) - var(--width-of-game) * 0.1 -
      max((var(--height-of-app) - var(--abs-height-of-game)) / 2, 10px),
    var(--min-height-of-game) - var(--width-of-game) * 0.1
  );
}
header {
  text-align: center;
}

nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: calc(var(--un) * 5) 0;
}

.nav-button {
  height: calc(var(--un) * 8.5);
  width: calc(var(--un) * 17.5);
  margin: calc(var(--un) * 0.2);
  border-radius: calc(var(--un) * 4);
  font-size: 1.15rem;
  cursor: pointer;
}
</style>
