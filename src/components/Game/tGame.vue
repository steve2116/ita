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
import ProgressBar from "../../elements/progress-bar.vue";
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
  },
  methods: {
    clickEnergy() {
      try {
        this.gameData.resources.energy += this.getInfo.energyClick;
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
          this.gameData.resources.energy++;
        }
      } catch (e) {
        console.error(e);
      }
    },
    clickAir() {
      const { skills, resources } = this.gameData;
      const { getInfo } = this;
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
                  next(val) {
                    if (typeof val === "number") resources.energy = val;
                    else resources.energy = val(resources.energy);
                  },
                },
                air: {
                  get current() {
                    return skills.air;
                  },
                  next(val) {
                    if (typeof val === "number") skills.air = val;
                    else skills.air = val(skills.air);
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
                  next(val) {
                    if (typeof val === "number") resources.energy = val;
                    else resources.energy = val(resources.energy);
                  },
                },
                flora: {
                  get current() {
                    return skills.flora;
                  },
                  next(val) {
                    if (typeof val === "number") skills.flora = val;
                    else skills.flora = val(skills.flora);
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
                  next(val) {
                    if (typeof val === "number") resources.energy = val;
                    else resources.energy = val(resources.energy);
                  },
                },
                mass: {
                  get current() {
                    return resources.mass;
                  },
                  next(val) {
                    if (typeof val === "number") resources.mass = val;
                    else resources.mass = val(resources.mass);
                  },
                },
                rodent: {
                  get current() {
                    return skills.rodent;
                  },
                  next(val) {
                    if (typeof val === "number") skills.rodent = val;
                    else skills.rodent = val(skills.rodent);
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
          console.error(`Error attempting purchase of ${name}`);
        } catch (e) {
          console.error("Error attempting purchase");
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
