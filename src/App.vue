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
        @change-theme="changeTheme"
      />
    </div>
  </div>
</template>

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
    this.timers.save = setInterval(
      () => localStorage.setItem("ita-data", this.getSaveData()),
      60000 // 1 minute
    );
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
  },
};
</script>
