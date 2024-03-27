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
        @click="tab = 'stats'"
      >
        Stats
      </button>
      <button
        :class="navButtonStyle"
        @click="tab = 'settings'"
      >
        Settings
      </button>
      <button
        :class="navButtonStyle"
        @click="tab = 'other'"
      >
        Other
      </button>
    </nav>
    <main>
      <Gamet
        v-if="tab === 'game' && getInfo"
        :theme="theme"
        :on-tick-ref="tick.onTickFuncs"
        :tick-rate="currentTickRate"
        :game-data="gameData"
        :get-info="getInfo"
        :game-stats="gameStats"
        :general-data="generalData"
      />

      <Statst
        v-else-if="tab === 'stats'"
        :theme="theme"
        :get-info="getInfo"
        :game-data="gameData"
        :game-stats="gameStats"
        :version="generalData.version"
      />
      <Settingst
        v-else-if="tab === 'settings'"
        :theme="theme"
        :seconds-until-save="generalData.secondsUntilSave"
        :initial-tick-rate="currentTickRate"
        :initial-version="generalData.version"
        @manual-save="saveGame"
        @change-theme="() => $emit('changeTheme')"
        @change-tick-speed="changeTickSpeed"
      />

      <template v-else-if="tab === 'other'"><Othert :theme="theme" /></template>
      <template v-else
        >How... nevermind, please report a bug. Somehow you made it onto tab [
        {{ tab }} ]</template
      >
    </main>
  </div>
</template>

<script>
import Gamet from "./Game/tGame.vue";
import Settingst from "./Game/tSettings.vue";
import Statst from "./Game/tStats.vue";
import Othert from "./Game/tOther.vue";

import CryptoJS from "crypto-js";
import { Information, airTick, floraTick, rodentTick } from "../utils";

export default {
  name: "Game",
  components: {
    Settingst,
    Gamet,
    Statst,
    Othert,
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
      /** @type {Record<string, number>} */
      timers: {},
      generalData: {
        secondsUntilSave: 150,
        savingIntervalInSeconds: 300,
        beat: false,
        state: {
          gameShop: false,
        },
      },
      tick: {
        tickRateMin: 50,
        /** @type {Record<string, {func: (tickRate: number, deleteFunc: () => void, nameOfFunc: string) => void, progress: number}>} */
        onTickFuncs: {},
        onTick() {
          const { tickRate, onTickFuncs } = this;
          Object.entries(this.onTickFuncs).forEach(([key, funcData]) =>
            funcData.func(tickRate, () => delete onTickFuncs[key], key)
          );
        },
      },
      gameData: {},
      gameStats: {},
      /** @type {Information} */
      getInfo: null,
    };
  },
  mounted() {
    const onLoadTimer = setInterval(() => {
      if (typeof this.initialGameData.generalData.new === "boolean") {
        clearInterval(onLoadTimer);
        const { generalData, tick, gameData, gameStats } = this.initialGameData;
        const { skillTicks, ...otherGameData } = gameData;
        this.generalData = { ...generalData, ...this.generalData };
        this.tick = { ...tick, ...this.tick };
        this.gameData = { ...otherGameData };
        this.gameStats = { ...gameStats };
        this.timers.tick = setInterval(() => {
          this.tick.onTick();
          this.gameStats.time.online += this.tick.tickRate / 1000;
        }, this.tick.tickRate);
        this.timers.save = setInterval(() => {
          this.generalData.secondsUntilSave -= 1;
          if (this.generalData.secondsUntilSave <= 0) this.saveGame();
        }, 1000);
        const tempGameData = this.gameData;
        this.getInfo = new Information(
          {
            get energy() {
              return tempGameData.resources.energy;
            },
            get mass() {
              return tempGameData.resources.mass;
            },
          },
          {
            get air() {
              return tempGameData.skills.air;
            },
            get flora() {
              return tempGameData.skills.flora;
            },
            get rodent() {
              return tempGameData.skills.rodent;
            },
          },
          {
            get items() {
              return tempGameData.evolutions.items;
            },
          }
        );
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
    currentTickRate() {
      const { tickRate } = this.tick;
      return Number(tickRate) === tickRate ? tickRate : 250;
    },
  },
  methods: {
    getSaveData() {
      const encrypt = (text) => {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
      };
      const skillTicks = {};
      ["air", "flora", "rodent"].forEach((skill) => {
        try {
          skillTicks[skill] = this.tick.onTickFuncs[skill].progress;
        } catch (e) {
          skillTicks[skill] = 0;
        }
      });
      return encrypt(
        JSON.stringify({
          version: "0.1.0",
          theme: this.theme,
          lastReset: this.generalData.lastReset,
          tick: { tickRate: this.tick.tickRate },
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
            evolutions: { items: this.gameData.evolutions.items },
          },
          gameStats: {
            clicks: this.gameStats.clicks,
            resources: {
              energy: {
                gained: {
                  air: this.gameStats.resources.energy.gained.air,
                  flora: this.gameStats.resources.energy.gained.flora,
                  rodent: this.gameStats.resources.energy.gained.rodent,
                  clicks: this.gameStats.resources.energy.gained.clicks,
                },
                lost: {
                  air: this.gameStats.resources.energy.lost.air,
                  flora: this.gameStats.resources.energy.lost.flora,
                  rodent: this.gameStats.resources.energy.lost.rodent,
                },
              },
              mass: {
                gained: {
                  air: this.gameStats.resources.mass.gained.air,
                  flora: this.gameStats.resources.mass.gained.flora,
                  rodent: this.gameStats.resources.mass.gained.rodent,
                  clicks: this.gameStats.resources.mass.gained.clicks,
                },
                lost: {
                  air: this.gameStats.resources.mass.lost.air,
                  flora: this.gameStats.resources.mass.lost.flora,
                  rodent: this.gameStats.resources.mass.lost.rodent,
                },
              },
            },
            time: {
              online: this.gameStats.time.online,
              playedSince: this.gameStats.time.playedSince,
            },
          },
        })
      );
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
          const { tick, timers, gameStats } = this;
          tick.onTickFuncs.newTickRate = {
            func(tickRate, deleteFunc) {
              deleteFunc();
              tick.tickRate = Math.max(tick.tickRateMin, newTickRate);
              clearInterval(timers.tick);
              timers.tick = setInterval(() => {
                tick.onTick();
                gameStats.time.online += tick.tickRate / 1000;
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
      const { getInfo } = this;
      const stats = this.gameStats.resources;
      onTickFuncs.unlockAir = {
        func(tickRate, deleteFunc) {
          if (skills.air >= 0 || resources.energy >= 10) {
            deleteFunc();
            skills.air = Math.max(0, skills.air);
            if (skills.air > 0) {
              onTickFuncs.air = {
                func(tickRate) {
                  const { energyCost, timePerProgress, func } =
                    airTick(getInfo);
                  if (resources.energy >= energyCost) {
                    this.progress += tickRate;
                    if (this.progress >= timePerProgress) {
                      func({
                        energy: {
                          get current() {
                            return resources.energy;
                          },
                          set current(val) {
                            resources.energy = val;
                          },
                          add(vals) {
                            resources.energy +=
                              (vals.gain || 0) - (vals.loss || 0);
                            stats.energy.gained.air += vals.gain || 0;
                            stats.energy.lost.air += vals.loss || 0;
                          },
                        },
                        air: {
                          get current() {
                            return skills.air;
                          },
                          set current(val) {
                            skills.air = val;
                          },
                          add(vals) {
                            skills.air += (vals.gain || 0) - (vals.loss || 0);
                          },
                        },
                      });
                      this.progress = 0;
                    }
                  } else if (this.progress < timePerProgress)
                    this.progress += tickRate;
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
                  const { energyCost, timePerProgress, func } =
                    floraTick(getInfo);
                  if (resources.energy >= energyCost) {
                    this.progress += tickRate;
                    if (this.progress >= timePerProgress) {
                      func({
                        energy: {
                          get current() {
                            return resources.energy;
                          },
                          set current(val) {
                            resources.energy = val;
                          },
                          add(vals) {
                            resources.energy +=
                              (vals.gain || 0) - (vals.loss || 0);
                            stats.energy.gained.flora += vals.gain || 0;
                            stats.energy.lost.flora += vals.loss || 0;
                          },
                        },
                        flora: {
                          get current() {
                            return skills.flora;
                          },
                          set current(val) {
                            skills.flora = val;
                          },
                          add(vals) {
                            skills.flora += (vals.gain || 0) - (vals.loss || 0);
                          },
                        },
                      });
                      this.progress = 0;
                    }
                  } else if (this.progress < timePerProgress)
                    this.progress += tickRate;
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
          if (
            skills.rodent >= 0 ||
            resources.energy >= 100000 ||
            resources.mass >= 0
          ) {
            deleteFunc();
            skills.rodent = Math.max(0, skills.rodent);
            resources.mass = Math.max(0, resources.mass);
            if (skills.rodent > 0) {
              onTickFuncs.rodent = {
                func(tickRate) {
                  const { energyCost, massCost, timePerProgress, func } =
                    rodentTick(getInfo);
                  if (
                    resources.energy >= energyCost &&
                    resources.mass >= massCost
                  ) {
                    this.progress += tickRate;
                    if (this.progress >= timePerProgress) {
                      func({
                        energy: {
                          get current() {
                            return resources.energy;
                          },
                          set current(val) {
                            resources.energy = val;
                          },
                          add(vals) {
                            resources.energy +=
                              (vals.gain || 0) - (vals.loss || 0);
                            stats.energy.gained.rodent += vals.gain || 0;
                            stats.energy.lost.rodent += vals.loss || 0;
                          },
                        },
                        mass: {
                          get current() {
                            return resources.mass;
                          },
                          set current(val) {
                            resources.mass = val;
                          },
                          add(vals) {
                            resources.mass +=
                              (vals.gain || 0) - (vals.loss || 0);
                            stats.mass.gained.rodent += vals.gain || 0;
                            stats.mass.lost.rodent += vals.loss || 0;
                          },
                        },
                        rodent: {
                          get current() {
                            return skills.rodent;
                          },
                          set current(val) {
                            skills.rodent = val;
                          },
                          add(vals) {
                            skills.rodent +=
                              (vals.gain || 0) - (vals.loss || 0);
                          },
                        },
                      });
                      this.progress = 0;
                    }
                  } else if (this.progress < timePerProgress)
                    this.progress += tickRate;
                },
                progress: Math.floor(skillTicks.rodent / tickRate) * tickRate,
              };
            }
          }
        },
        progress: 0,
      };
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
