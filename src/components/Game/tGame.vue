<template>
  <div class="game-holder">
    <div class="units">
      <p>Energy: {{ energy }}</p>
      <p v-if="unlockMass">Mass: {{ mass }}</p>
      <template v-else />
    </div>
    <template v-if="showShop">
      <div class="pressers">
        <button
          :class="clickerButtonStyle"
          @click="() => (showShop = false)"
        >
          Exit
        </button>
      </div>
      <Shop
        :theme="theme"
        :owned-items="gameData.evolutions.items"
        :skills="gameData.skills"
        :mobile-ref="mobileRef"
        :beat="endRef"
        @purchase="shopPurchase"
      />
    </template>
    <template v-else>
      <div class="pressers">
        <button
          :class="shopButtonStyle"
          @click="() => (showShop = true)"
          :disabled="hideShop"
        >
          Evolve Menu
        </button>
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
    </template>
  </div>
</template>

<script>
import { ProgressBar, showNotification } from "../../elements/";
import Shop from "./Shop.vue";
import {
  Information,
  airTick,
  floraTick,
  numberAsReadable,
  rodentTick,
} from "../../utils";

export default {
  name: "Gamet",
  components: {
    ProgressBar,
    Shop,
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
    getInfo: {
      type: Information,
      required: true,
    },
    gameStats: {
      type: Object,
      required: true,
    },
    generalData: {
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
      showShop: false,
    };
  },
  computed: {
    clickerButtonStyle() {
      return {
        "no-select": true,
        "light-button-2": this.theme === "light",
        "dark-button-2": this.theme === "dark",
      };
    },
    energy() {
      try {
        return numberAsReadable(Math.round(this.gameData.resources.energy));
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
        return numberAsReadable(
          Number(Math.floor(this.gameData.resources.mass * 100) / 100)
        );
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
    hideShop() {
      try {
        const { air } = this.gameData.skills;
        return false;
      } catch (e) {
        return true;
      }
    },
    shopButtonStyle() {
      if (this.hideShop) return this.clickerButtonStyle;
      return Object.assign({}, this.clickerButtonStyle, {
        invisible: this.gameData.skills.air < 15,
      });
    },
    mobileRef() {
      const gen = this.generalData;
      return {
        get isMobile() {
          return gen.mobile;
        },
        mobile() {
          gen.mobile = true;
        },
      };
    },
    endRef() {
      const thisRef = this;
      return {
        get val() {
          return thisRef.generalData.beat;
        },
        set val(val) {
          if (typeof val === "boolean") thisRef.generalData.beat = val;
        },
      };
    },
  },
  methods: {
    clickEnergy() {
      try {
        const gain = this.getInfo.energyClick;
        this.gameStats.clicks++;
        this.gameData.resources.energy += gain;
        this.gameStats.resources.energy.gained.clicks += gain;
      } catch (e) {
        console.error(e);
      }
    },
    holdEnergy() {
      try {
        if (!this.preventHold.energy) {
          this.preventHold.energy = true;
          setTimeout(() => {
            this.preventHold.energy = false;
          }, 200);
          this.clickEnergy();
        }
      } catch (e) {
        console.error(e);
      }
    },
    clickAir() {
      const { skills, resources } = this.gameData;
      const { getInfo } = this;
      const stats = this.gameStats.resources;
      skills.air = 1;
      this.onTickRef.air = {
        func(tickRate) {
          const { energyCost, timePerProgress, func } = airTick(getInfo);
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
                    resources.energy += (vals.gain || 0) - (vals.loss || 0);
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
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
    clickFlora() {
      const { skills, resources } = this.gameData;
      const { getInfo } = this;
      const stats = this.gameStats.resources;
      skills.flora = 1;
      this.onTickRef.flora = {
        func(tickRate) {
          const { energyCost, timePerProgress, func } = floraTick(getInfo);
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
                    resources.energy += (vals.gain || 0) - (vals.loss || 0);
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
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
    clickRodent() {
      const { skills, resources } = this.gameData;
      const { getInfo } = this;
      const stats = this.gameStats.resources;
      skills.rodent = 1;
      resources.mass = 0;
      this.onTickRef.rodent = {
        func(tickRate) {
          const { energyCost, massCost, timePerProgress, func } =
            rodentTick(getInfo);
          if (resources.energy >= energyCost && resources.mass >= massCost) {
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
                    resources.energy += (vals.gain || 0) - (vals.loss || 0);
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
                    resources.mass += (vals.gain || 0) - (vals.loss || 0);
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
                    skills.rodent += (vals.gain || 0) - (vals.loss || 0);
                  },
                },
              });
              this.progress = 0;
            }
          } else if (this.progress < timePerProgress) this.progress += tickRate;
        },
        progress: 0,
      };
    },
    shopPurchase(item) {
      try {
        const { resources, evolutions, skills } = this.gameData;
        const { name, price, unlock } = item;
        if (
          Object.entries(unlock).every(
            ([type, value]) => skills[type] >= value
          ) &&
          Object.entries(price).every(
            ([type, value]) => resources[type] >= value
          )
        ) {
          Object.entries(price).forEach(([type, value]) => {
            resources[type] -= value;
          });
          evolutions.items.push(name);
        }
      } catch (e) {
        try {
          const { name } = item;
          showNotification(`Error attempting purchase of ${name}`);
        } catch (e) {
          showNotification("Error attempting purchase");
        }
      }
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
.invisible {
  background-color: transparent;
  color: transparent;
  border: none;
}
</style>
