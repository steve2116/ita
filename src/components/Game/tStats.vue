<template>
  <h2>Statistics!</h2>
  <section>
    <h3>Game stats</h3>
    <section class="one">
      <p>Game version: v{{ version }}</p>
      <p>Time played: {{ secondsAsReadable(timePlayed) }}</p>
      <p>Played since: {{ playedSince }}</p>
    </section>
  </section>
  <section>
    <h3>Resources earned</h3>
    <section
      class="resource-info one"
      v-for="[name, resource] in Object.entries(resources)"
    >
      <h4>{{ name[0].toUpperCase() + name.slice(1) }}:</h4>
      <section :class="`${name}-info one`">
        <p class="one">
          Gained: {{ numberAsReadable(sumObj(resource.gained))
          }}<button
            v-show="sumObj(resource.gained) > 0"
            :class="showButtonStyle"
            @click="
              () =>
                changeShow(
                  name,
                  'gained',
                  !(rsrcsShow[name] && rsrcsShow[name].gained)
                )
            "
          >
            ^
          </button>
        </p>
        <div
          v-show="rsrcsShow[name] && rsrcsShow[name].gained"
          :class="resourceSubStyle"
          @click="() => changeShow(name, 'gained', false)"
        >
          <template
            class="sub-text"
            v-for="[type, value] in Object.entries(resource.gained)"
          >
            <p v-if="value > 0">{{ `${type}: ${numberAsReadable(value)}` }}</p>
            <template v-else />
          </template>
        </div>
        <p class="one">
          Spent: {{ numberAsReadable(sumObj(resource.lost))
          }}<button
            v-show="sumObj(resource.lost) > 0"
            :class="showButtonStyle"
            @click="
              () =>
                changeShow(
                  name,
                  'lost',
                  !(rsrcsShow[name] && rsrcsShow[name].lost)
                )
            "
          >
            ^
          </button>
        </p>
        <div
          v-show="rsrcsShow[name] && rsrcsShow[name].lost"
          :class="resourceSubStyle"
          @click="() => changeShow(name, 'lost', false)"
        >
          <template
            class="sub-text"
            v-for="[type, value] in Object.entries(resource.lost)"
          >
            <p v-if="value > 0">{{ `${type}: ${numberAsReadable(value)}` }}</p>
            <template v-else />
          </template>
        </div>
      </section>
    </section>
  </section>
  <section>
    <h3>Clicking</h3>
    <section class="click-info three">
      <p>Total clicks: {{ clicking.clicks }}</p>
      <p v-if="clicking.energy > 1">Energy per click: {{ clicking.energy }}</p>
      <template v-else />
    </section>
  </section>
  <section v-if="Object.keys(skills).length > 0">
    <h3>Skills</h3>
    <section
      v-for="[name, skill] in Object.entries(skills)"
      class="skill-info one"
    >
      <h4>{{ name[0].toUpperCase() + name.slice(1) }}</h4>
      <section :class="`${name}-info one`">
        <p>Time: {{ secondsAsReadable(skill.time / 1000) }}</p>
        <p>Cost to tick:</p>
        <template v-for="[type, value] in Object.entries(skill.cost)">
          <p
            v-if="value > 0"
            class="one"
          >
            {{
              `${type[0].toUpperCase()}${type.slice(1)}: ${numberAsReadable(
                value
              )}`
            }}
          </p>
          <template v-else />
        </template>
        <p>Gain per tick:</p>
        <template v-for="[type, value] in Object.entries(skill.gain)">
          <p
            v-if="value > 0"
            class="one"
          >
            {{
              `${type[0].toUpperCase()}${type.slice(1)}: ${numberAsReadable(
                value
              )}`
            }}
          </p>
          <template v-else />
        </template>
        <p>Softcap starts at level {{ skill.softcap }}</p>
      </section>
    </section>
  </section>
  <template v-else />
</template>

<script>
import { Information, secondsAsReadable, numberAsReadable } from "../../utils";

export default {
  name: "Statst",
  props: {
    theme: {
      type: String,
      required: true,
    },
    getInfo: {
      type: Information,
      required: true,
    },
    gameData: {
      type: Object,
      required: true,
    },
    gameStats: {
      type: Object,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      clicking: {
        clicks: 0,
        energy: 0,
      },
      /** @type {{[resource: string]: {[key in ("gained" | "lost")]: {[type: string]: number}}}} */
      resources: { energy: { gained: { clicks: 0 }, lost: {} } },
      skills: {},
      timePlayed: 0,
      playedSince: "",
      /** @type {{[resource: string]: { gained: boolean, lost: boolean}}} */
      rsrcsShow: {},
    };
  },
  computed: {
    resourceSubStyle() {
      return {
        two: true,
        "resource-split": true,
        "light-stats-hover": this.theme === "light",
        "dark-stats-hover": this.theme === "dark",
        "light-border-1": this.theme === "light",
        "dark-border-1": this.theme === "dark",
      };
    },
    showButtonStyle() {
      return {
        "show-button": true,
        "light-border-1": this.theme === "light",
        "dark-border-1": this.theme === "dark",
        "light-font-1": this.theme === "light",
        "dark-font-1": this.theme === "dark",
      };
    },
  },
  methods: {
    loadMethod() {
      const thisRef = this;
      const timer = setInterval(() => {
        if (typeof thisRef.getInfo.check === "string") {
          clearInterval(timer);
          /** @type {Information} */
          const getInfo = thisRef.getInfo;
          const { gameData, gameStats } = thisRef;
          const { resources, clicking, skills } = thisRef;
          clicking.clicks = gameStats.clicks;
          thisRef.timePlayed = Math.round(gameStats.time.online);
          thisRef.playedSince = new Date(
            gameStats.time.playedSince
          ).toLocaleDateString("en-UK", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          resources.energy = gameStats.resources.energy;
          if (gameData.resources.mass >= 0)
            resources.mass = gameStats.resources.mass;
          clicking.energy = getInfo.energyClick;
          if (gameData.skills.air > 0) skills.air = getInfo.airInfo;
          if (gameData.skills.flora > 0) skills.flora = getInfo.floraInfo;
          if (gameData.skills.rodent > 0) skills.rodent = getInfo.rodentInfo;
        }
      }, 200);
    },
    secondsAsReadable,
    numberAsReadable,
    sumObj(obj) {
      return Object.values(obj).reduce((acc, curr) => acc + curr, 0);
    },
    changeShow(name, type, value = false) {
      try {
        this.rsrcsShow[name][type] = value;
      } catch (e) {
        if (!this.rsrcsShow[name]) this.rsrcsShow[name] = {};
        if (!this.rsrcsShow[name][type]) this.rsrcsShow[name][type] = value;
      }
    },
  },
  mounted() {
    this.loadMethod();
  },
  beforeUpdate() {
    this.loadMethod();
  },
};
</script>

<style scoped>
h2 {
  margin-bottom: calc(var(--un) * 1);
}
.one {
  margin-left: calc(var(--un) * 2);
}
.two {
  margin-left: calc(var(--un) * 4);
}
.three {
  margin-left: calc(var(--un) * 6);
}
.four {
  margin-left: calc(var(--un) * 8);
}

.sub-text {
  font-size: 0.85em;
  font-style: italic;
}

.resource-split {
  position: absolute;
  z-index: 1;
  height: fit-content;
  width: calc(var(--un) * 30);
  margin-top: calc(var(--un) * -2);
  margin-left: calc(var(--un) * 10);
  padding: calc(var(--un) * 1.5);
  border-width: calc(var(--border-width) * 0.7);
  border-radius: calc(var(--un) * 5);
}

.show-button {
  margin: calc(var(--un));
  margin-top: 0;
  margin-bottom: 0;
  padding: calc(var(--un));
  border-radius: calc(var(--un) * 5);
  cursor: pointer;
  background-color: transparent;
  border-width: calc(var(--border-width) * 0.7);
  font-size: 0.75em;
}
</style>
