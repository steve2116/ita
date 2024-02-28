<template>
  <div class="game-holder">
    <div class="units">
      <p>Energy: {{ energy }}</p>
      <p v-if="unlockMass">Mass: {{ mass }}</p>
      <template v-else />
    </div>
    <div class="pressers">
      <button
        :class="clickerButtonStyle"
        @click="clickEnergy"
        v-on:keydown.enter.prevent="holdEnergy"
      >
        Exist faster
      </button>
      <template v-if="unlockAir && gameData.skills.air === 0">
        <br />
        <button
          :class="clickerButtonStyle"
          @click="clickAir"
        >
          Start breathing?
        </button>
      </template>
      <template v-else />
      <template v-if="unlockFlora && gameData.skills.flora === 0">
        <br />
        <button
          :class="clickerButtonStyle"
          @click="clickFlora"
        >
          Start foraging?
        </button>
      </template>
      <template v-else />
      <template v-if="unlockRodent && gameData.skills.rodent === 0">
        <br />
        <button
          :class="clickerButtonStyle"
          @click="clickRodent"
        >
          Hunt?
        </button>
      </template>
      <template v-else />
    </div>
    <template v-if="unlockAir && gameData.skills.air !== 0">
      <br />
      <p>Air: {{ air }}</p>
      <ProgressBar
        :theme="theme"
        :info="airProgressBar"
      />
    </template>
    <template v-else />
    <template v-if="unlockFlora && gameData.skills.flora !== 0">
      <br />
      <p>Flora: {{ flora }}</p>
      <p :class="floraPBar">
        <ProgressBar
          :theme="theme"
          :info="floraProgressBar"
        />
      </p>
    </template>
    <template v-else />
    <template v-if="unlockRodent && gameData.skills.rodent !== 0">
      <br />
      <p>Rodent: {{ rodent }}</p>
      <ProgressBar
        :theme="theme"
        :info="rodentProgressBar"
      />
    </template>
    <template v-else />
  </div>
</template>

<script>
import ProgressBar from "../../elements/progress-bar.vue";
import { airTick, floraTick, numberAsReadable, rodentTick } from "../../utils";

export default {
  name: "Gamet",
  components: {
    ProgressBar,
  },
  props: {
    theme: {
      type: String,
      required: true,
    },
    onTickRef: {
      type: Object,
      required: true,
    },
    tickRate: {
      type: Number,
      required: true,
    },
    gameData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      preventHold: {
        energy: false,
      },
      barLength: 50,
    };
  },
  computed: {
    clickerButtonStyle() {
      return {
        "light-button-2": this.theme === "light",
        "dark-button-2": this.theme === "dark",
      };
    },
    energy() {
      try {
        return numberAsReadable(this.gameData.resources.energy);
      } catch (e) {
        return 0;
      }
    },
    unlockMass() {
      try {
        return this.gameData.resources.mass >= 0;
      } catch (e) {
        return false;
      }
    },
    mass() {
      try {
        return numberAsReadable(this.gameData.resources.mass);
      } catch (e) {
        return 0;
      }
    },
    unlockAir() {
      try {
        return this.gameData.skills.air >= 0;
      } catch (e) {
        return false;
      }
    },
    air() {
      return this.gameData.skills.air;
    },
    airProgressBar() {
      const { tickRate } = this;
      const { air } = this.onTickRef;
      return {
        get startProgress() {
          try {
            return air.progress;
          } catch (e) {
            return -1;
          }
        },
        timeToEnd: 2000,
        tickRate,
      };
    },
    unlockFlora() {
      try {
        return this.gameData.skills.flora >= 0;
      } catch (e) {
        return false;
      }
    },
    flora() {
      return this.gameData.skills.flora;
    },
    floraProgressBar() {
      const { tickRate } = this;
      const { flora } = this.onTickRef;
      return {
        get startProgress() {
          try {
            return flora.progress;
          } catch (e) {
            return -1;
          }
        },
        timeToEnd: 120000,
        tickRate,
      };
    },
    floraPBar() {
      try {
        return {
          "p-bar": true,
          "light-font-bad-1":
            this.onTickRef.flora.progress >= 120000 && this.theme === "light",
          "dark-font-bad-1":
            this.onTickRef.flora.progress >= 120000 && this.theme === "dark",
        };
      } catch (e) {
        return {
          "p-bar": true,
        };
      }
    },
    unlockRodent() {
      try {
        return this.gameData.skills.rodent >= 0;
      } catch (e) {
        return false;
      }
    },
    rodent() {
      return this.gameData.skills.rodent;
    },
    rodentProgressBar() {
      const { tickRate } = this;
      const { rodent } = this.onTickRef;
      return {
        get startProgress() {
          try {
            return rodent.progress;
          } catch (e) {
            return -1;
          }
        },
        timeToEnd: 600000,
        tickRate,
      };
    },
    rodentPBar() {
      try {
        return {
          "p-bar": true,
          "light-font-bad-1":
            this.onTickRef.rodent.progress >= 600000 && this.theme === "light",
          "dark-font-bad-1":
            this.onTickRef.rodent.progress >= 600000 && this.theme === "dark",
        };
      } catch (e) {
        return {
          "p-bar": true,
        };
      }
    },
  },
  methods: {
    clickEnergy() {
      try {
        this.gameData.resources.energy++;
      } catch (e) {
        console.error(e);
      }
    },
    holdEnergy() {
      try {
        this.clickEnergy();
        // if (!this.preventHold.energy) {
        //   this.preventHold.energy = true;
        //   setTimeout(() => {
        //     this.preventHold.energy = false;
        //   }, 200);
        //   this.gameData.resources.energy++;
        // }
      } catch (e) {
        console.error(e);
      }
    },
    clickAir() {
      const { skills, resources } = this.gameData;
      skills.air = 1;
      this.onTickRef.air = {
        func(tickRate) {
          const { energyCost, timePerProgress, func } = airTick();
          if (resources.energy >= energyCost) {
            this.progress += tickRate;
            if (this.progress >= timePerProgress) {
              func({
                energy: {
                  get current() {
                    return resources.energy;
                  },
                  next: (val) => (resources.energy = val),
                },
                air: {
                  get current() {
                    return skills.air;
                  },
                  next: (val) => (skills.air = val),
                },
              });
              this.progress = 0;
            }
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
    clickFlora() {
      const { skills, resources } = this.gameData;
      skills.flora = 1;
      this.onTickRef.flora = {
        func(tickRate) {
          const { energyCost, timePerProgress, func } = floraTick();
          if (resources.energy >= energyCost) {
            this.progress += tickRate;
            if (this.progress >= timePerProgress) {
              func({
                energy: {
                  get current() {
                    return resources.energy;
                  },
                  next: (val) => (resources.energy = val),
                },
                flora: {
                  get current() {
                    return skills.flora;
                  },
                  next: (val) => (skills.flora = val),
                },
              });
              this.progress = 0;
            }
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
    clickRodent() {
      const { skills, resources } = this.gameData;
      skills.rodent = 1;
      resources.mass = 0;
      this.onTickRef.rodent = {
        func(tickRate) {
          const { energyCost, massCost, timePerProgress, func } = rodentTick();
          if (resources.energy >= energyCost && resources.mass >= massCost) {
            this.progress += tickRate;
            if (this.progress >= timePerProgress) {
              func({
                energy: {
                  get current() {
                    return resources.energy;
                  },
                  next: (val) => (resources.energy = val),
                },
                mass: {
                  get current() {
                    return resources.mass;
                  },
                  next: (val) => (resources.mass = val),
                },
                rodent: {
                  get current() {
                    return skills.rodent;
                  },
                  next: (val) => (skills.rodent = val),
                },
              });
              this.progress = 0;
            }
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
  },
};
</script>

<style scoped>
.game-holder {
}
.units {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: calc(var(--un) * 2);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}
.pressers {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
button {
  box-sizing: content-box;
  height: calc(var(--un) * 6.5);
  width: calc(var(--un) * 15);
  margin: calc(var(--un) * 0.2);
  padding: calc(var(--un) * 1);
  border-radius: calc(var(--un) * 5);
  font-size: 1.15rem;
  cursor: pointer;
}
</style>
