<template>
  <div
    id="holder"
    :class="holderStyle"
  >
    <div
      id="game"
      :class="gameStyle"
    >
      <Game
        :theme="theme"
        :secondsUntilSave="secondsUntilSave"
        @manual-save="saveGame"
        @change-theme="changeTheme"
      />
    </div>
  </div>
</template>

// theme-rotation: [ "/src/components/Game/tSettings.vue" ]

<script>
import Game from "./components/Game.vue";
export default {
  name: "App",
  components: {
    Game,
  },
  data() {
    return {
      timers: {},
      tickRate: 200,
      data: {
        new: true,
      },
      theme: "light",
      secondsUntilSave: 150,
      savingIntervalInSeconds: 300,
    };
  },
  mounted() {
    const data = JSON.parse(localStorage.getItem("ita-data"));
    if (data) {
      switch (data.version) {
        default: {
          this.data.new = false;
          this.theme = data.theme;
          break;
        }
      }
    }
    // this.timers.tick = setInterval(() => {}, 200);
    this.timers.save = setInterval(() => {
      this.secondsUntilSave -= 1;
      if (this.secondsUntilSave <= 0) this.saveGame();
    }, 1000);
  },
  unmounted() {
    Object.values(this.timers).forEach((timer) => clearInterval(timer));
  },
  computed: {
    holderStyle() {
      return {
        "light-font-1": this.theme === "light",
        "dark-font-1": this.theme === "dark",
        "light-bg-1": this.theme === "light",
        "dark-bg-1": this.theme === "dark",
      };
    },
    gameStyle() {
      return {
        "light-bg-2": this.theme === "light",
        "dark-bg-2": this.theme === "dark",
        "light-border-1": this.theme === "light",
        "dark-border-1": this.theme === "dark",
      };
    },
  },
  methods: {
    getSaveData() {
      return JSON.stringify({
        tickRate: this.tickRate,
        theme: this.theme,
      });
    },
    changeTheme() {
      switch (this.theme) {
        case "light": {
          this.theme = "dark";
          break;
        }
        case "dark": {
          this.theme = "light";
          break;
        }
        default: {
          this.theme = "light";
          break;
        }
      }
    },
    saveGame() {
      this.secondsUntilSave = this.savingIntervalInSeconds;
      localStorage.setItem("ita-data", this.getSaveData());
    },
  },
};
</script>
