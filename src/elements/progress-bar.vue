<template>
  <div :class="container">
    <div
      :class="bar"
      :style="barStyle"
    >
      <div :class="circle" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    theme: {
      type: String,
      required: true,
    },
    info: {
      // { startProgress?: Number; timeToEnd: Number; tickRate: number; }
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      previousProgress: 0,
    };
  },
  computed: {
    container() {
      return {
        "bar-container": true,
        "light-progress-empty": this.theme === "light",
        "dark-progress-empty": this.theme === "dark",
      };
    },
    bar() {
      return {
        bar: true,
        "light-progress-bar": this.theme === "light",
        "dark-progress-bar": this.theme === "dark",
      };
    },
    circle() {
      return {
        "bar-circle": true,
        "light-progress-circle": this.theme === "light",
        "dark-progress-circle": this.theme === "dark",
      };
    },
    progress() {
      const tickProgress = this.info.startProgress || 0;
      const progress = tickProgress / this.info.timeToEnd;
      return `[${""
        .padEnd(Math.round(progress * this.barLength), "#")
        .padEnd(this.barLength, "-")}]`;
    },
    barStyle() {
      const progress =
        (100 * this.info.startProgress || 0) / this.info.timeToEnd;
      const previous = this.previousProgress;
      this.previousProgress = progress;
      let tickRate = 250;
      try {
        tickRate = this.info.tickRate;
      } catch (e) {}
      return {
        width: `${progress}%`,
        transitionDuration: progress < previous ? "0s" : `${tickRate}ms`,
      };
    },
  },
};
</script>

<style scoped>
.bar-container {
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  min-height: 1rem;
  padding: calc(var(--un) * 0.5);
  border-radius: calc(var(--un) * 3);
}
.bar {
  height: 1em;
  min-height: 0.9rem;
  border-radius: calc(var(--un) * 3);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  transition-property: width;
  transition-timing-function: linear;
  transition-delay: 0s;
}
.bar-circle {
  position: relative;
  left: 0%;
  width: 1em;
  height: 1em;
  min-height: 0.9rem;
  border-radius: 100%;
}
</style>
