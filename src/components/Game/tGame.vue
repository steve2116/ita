<template>
  <div class="game-holder">
    <p>Energy: {{ energy }}</p>
    <button
      :class="clickerButtonStyle"
      @click="clickEnergy"
      v-on:keydown.enter.prevent="holdEnergy"
    >
      Exist faster
    </button>
    <br />
    <template v-if="unlockAir">
      <button
        v-if="gameData.skills.air === 0"
        :class="clickerButtonStyle"
        @click="clickAir"
      >
        Start breathing?
      </button>
      <template v-else>
        <p>Air: {{ air }}</p>
        <p :class="airPBar">
          {{ airProgress }}
        </p>
      </template>
    </template>
    <template v-else />
    <br />
    <template v-if="unlockFlora">
      <button
        v-if="gameData.skills.flora === 0"
        :class="clickerButtonStyle"
        @click="clickFlora"
      >
        Forage?
      </button>
      <template v-else>
        <p>Flora: {{ flora }}</p>
        <p :class="floraPBar">
          {{ floraProgress }}
        </p>
      </template>
    </template>
    <template v-else />
    <br />
    <template v-if="unlockRodent">
      <button
        v-if="gameData.skills.rodent === 0"
        :class="clickerButtonStyle"
        @click="clickRodent"
      >
        Hunt?
      </button>
      <template v-else>
        <p>Rodent: {{ rodent }}</p>
        <p :class="rodentPBar">
          {{ rodentProgress }}
        </p>
      </template>
    </template>
    <template v-else />
  </div>
</template>

<script>
export default {
  name: "Gamet",
  props: {
    theme: {
      type: String,
      required: true,
    },
    onTickRef: {
      type: Object,
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
        return this.gameData.resources.energy;
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
    airProgress() {
      let tickProgress = 0;
      try {
        tickProgress = this.onTickRef.air.progress;
      } catch (e) {}
      const airTime = 2000;
      const progress = tickProgress / airTime;
      return `[${""
        .padEnd(Math.round(progress * this.barLength), "#")
        .padEnd(this.barLength, "-")}]`;
    },
    airPBar() {
      try {
        return {
          "p-bar": true,
          "light-font-bad-1":
            this.onTickRef.air.progress >= 2000 && this.theme === "light",
          "dark-font-bad-1":
            this.onTickRef.air.progress >= 2000 && this.theme === "dark",
        };
      } catch (e) {
        return {
          "p-bar": true,
        };
      }
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
    floraProgress() {
      let tickProgress = 0;
      try {
        tickProgress = this.onTickRef.flora.progress;
      } catch (e) {}
      const floraTime = 120000;
      const progress = tickProgress / floraTime;
      return `[${""
        .padEnd(Math.round(progress * this.barLength), "#")
        .padEnd(this.barLength, "-")}]`;
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
    rodentProgress() {
      let tickProgress = 0;
      try {
        tickProgress = this.onTickRef.rodent.progress;
      } catch (e) {}
      const rodentTime = 600000;
      const progress = tickProgress / rodentTime;
      return `[${""
        .padEnd(Math.round(progress * this.barLength), "#")
        .padEnd(this.barLength, "-")}]`;
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
        progress: 0,
      };
    },
    clickFlora() {
      const { skills, resources } = this.gameData;
      skills.flora = 1;
      this.onTickRef.flora = {
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
        progress: 0,
      };
    },
    clickRodent() {
      const { skills, resources } = this.gameData;
      skills.rodent = 1;
      this.onTickRef.rodent = {
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
                energyGainPerLevel * Math.floor(Math.sqrt(afterSoftcap / 2)) -
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
        progress: 0,
      };
    },
  },
};
</script>

<style scoped>
/* .game-holder {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
} */
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
.p-bar {
  font-family: monospace;
  overflow-wrap: break-word;
}
</style>
