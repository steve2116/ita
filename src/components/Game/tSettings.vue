<script setup>
import { secondsAsReadable } from "../../utils.js";
</script>

<template>
  <h2>Settings</h2>
  <section class="settings-holder">
    <div :class="settingStyle">
      <p>Manually save</p>
      <button
        :class="buttonStyle"
        @click="$emit('manualSave')"
      >
        {{ readableSaveTime }}
      </button>
    </div>
    <div :class="settingStyle">
      <p>Change Theme</p>
      <button
        :class="changeThemeButtonStyle"
        @click="$emit('changeTheme')"
      >
        {{ themeToSwitchTo }}
      </button>
    </div>
    <div :class="settingStyle">
      <p>Game update rate (ms)</p>
      <input
        id="tick-speed"
        type="number"
        v-model="tickSpeed"
        v-on:keypress.enter.prevent="$emit('changeTickSpeed', tickSpeed)"
      />
    </div>
  </section>
</template>

<script>
import { themeRotation } from "../../App.vue";

export default {
  name: "Settingst",
  props: {
    theme: {
      type: String,
      required: true,
    },
    secondsUntilSave: {
      type: Number,
      required: true,
    },
    initialTickRate: {
      type: Number,
      required: true,
    },
    initialVersion: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      themeRotation,
      tickSpeed: this.initialTickRate,
      selectVersion: this.initialVersion,
    };
  },
  emits: ["changeTheme", "manualSave", "changeTickSpeed"],
  computed: {
    buttonStyle() {
      return {
        "light-button-2": this.theme === "light",
        "dark-button-2": this.theme === "dark",
      };
    },
    changeThemeButtonStyle() {
      return {
        "light-button-2-theme": this.theme === "light",
        "dark-button-2-theme": this.theme === "dark",
      };
    },
    settingStyle() {
      return {
        setting: true,
        "light-bg-3": this.theme === "light",
        "dark-bg-3": this.theme === "dark",
      };
    },
    themeToSwitchTo() {
      const theme = this.themeRotation[this.theme];
      return theme[0].toUpperCase() + theme.slice(1);
    },
    readableSaveTime() {
      return secondsAsReadable(this.secondsUntilSave, "2");
    },
  },
  methods: {
    deleteClick() {
      localStorage.removeItem("ita-data");
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: calc(var(--un) * 1);
}
.settings-holder {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}
.setting {
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr;
  align-items: center;
  justify-items: center;
  height: calc(var(--un) * 8.5);
  width: calc(var(--un) * 40);
  margin: calc(var(--un) * 0.75);
  padding: calc(var(--un) * 0.75);
  border-radius: calc(var(--un) * 4);
}
.setting > * {
  margin: 0.1rem;
}
.setting > p {
  grid-column: 1 / 2;
  text-align: center;
  font-size: 1.15rem;
}
.setting > button {
  grid-column: 2 / 3;
  height: 100%;
  width: 100%;
  margin: calc(var(--un) * 0.2);
  border-radius: calc(var(--un) * 4);
  font-size: 1.15rem;
  cursor: pointer;
}
.setting > input,
.setting > select {
  grid-column: 2 / 3;
  height: 80%;
  width: 100%;
  margin: calc(var(--un) * 0.2);
  padding: calc(var(--un) * 1);
  border-radius: calc(var(--un) * 4);
  font-size: 1.15rem;
}
</style>
