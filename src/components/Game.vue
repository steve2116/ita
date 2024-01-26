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
      </template>
      <template v-else-if="tab === 'settings'">
        <Settingst @change-theme="() => $emit('changeTheme')" />
      </template>
      <template v-else-if="tab === 'credits-info'"
        ><p>Credits & Info</p></template
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
  border: 3px solid black;
}

nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: calc(var(--un) * 0.05) 0;
  border: 3px solid black;
}

.nav-button {
  height: calc(var(--un) * 0.085);
  width: calc(var(--un) * 0.175);
  margin: calc(var(--un) * 0.002);
  border-radius: calc(var(--un) * 0.04);
  font-size: 1.15rem;
}

main {
  border: 3px solid black;
}
</style>
