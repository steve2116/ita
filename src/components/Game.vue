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
      <template v-if="tab === 'game'">
        <p>Game</p>
        <br />
        <p>Still a game</p>
      </template>
      <template v-else-if="tab === 'settings'">
        <Settingst
          :theme="theme"
          :secondsUntilSave="secondsUntilSave"
          @manual-save="() => $emit('manualSave')"
          @change-theme="() => $emit('changeTheme')"
          @tab-to-game="() => (tab = 'game')"
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
import Settingst from "./Game/tSettings.vue";
export default {
  name: "Game",
  components: {
    Settingst,
  },
  props: {
    theme: {
      type: String,
      required: true,
    },
    secondsUntilSave: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tab: "settings",
    };
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
  emits: ["changeTheme", "manualSave"],
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
