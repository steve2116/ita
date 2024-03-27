<template>
  <div
    id="holder"
    :class="holderStyle"
  >
    <Notification :theme="theme" />
    <div
      id="game"
      :class="gameStyle"
    >
      <Game
        :theme="theme"
        :initial-game-data="currentInitialGameData"
        @change-theme="changeTheme"
      />
    </div>
  </div>
</template>

<script>
import Game from "./components/Game.vue";
import { Notification, showNotification } from "./elements";

import CryptoJS from "crypto-js";

export const currentVersion = "0.1.0";
export const versions = {
  "0.1.0": {
    version: "0.1.0",
    theme: "light",
    lastReset: new Date(Date.now()).toISOString(),
    tick: { tickRate: 250 },
    gameData: {
      resources: { energy: 0, mass: -1 },
      skills: { air: -1, flora: -1, rodent: -1 },
      skillTicks: { air: 0, flora: 0, rodent: 0 },
      evolutions: { items: [] },
    },
    gameStats: {
      clicks: 0,
      resources: {
        energy: {
          gained: { air: 0, flora: 0, rodent: 0, clicks: 0 },
          lost: { air: 0, flora: 0, rodent: 0 },
        },
        mass: {
          gained: { air: 0, flora: 0, rodent: 0, clicks: 0 },
          lost: { air: 0, flora: 0, rodent: 0 },
        },
      },
      time: {
        online: 0,
        playedSince: new Date(Date.now()).toISOString(),
      },
    },
  },
};
export function normaliseVersion(
  gameData,
  to = currentVersion,
  downgrade = false
) {
  switch (isVersion(gameData.version, to)) {
    case 2: {
      return Object.assign({}, gameData);
    }
    case 0: {
      return Object.assign({}, versions[to]);
    }
    case 1: {
      return Object.assign({}, updateSaveVersion(gameData, to));
    }
    case 3: {
      if (downgrade)
        return Object.assign({}, downdateSaveVersion(gameData, to));
      else return Object.assign({}, gameData);
    }
  }
}
export function updateSaveVersion(gameData, to) {
  switch (gameData.version) {
    case to: {
      return gameData;
    }
    default: {
      return versions[to];
    }
  }
}
export function downdateSaveVersion(gameData, to) {
  switch (gameData.version) {
    case to: {
      return gameData;
    }
    default: {
      return versions[to];
    }
  }
}
/**
 * Compares the version of the game data to the current version
 * @returns {0 | 1 | 2 | 3} 0 if initialVersion is invalid, 1 if it is older, 2 if it is the same, 3 if it is newer
 */
export function isVersion(initialVersion, to = currentVersion) {
  if (typeof initialVersion !== "string") return 0;
  const gameVersion = initialVersion.split(".").map((x) => parseInt(x, 10));
  const toVersion = to.split(".").map((x) => parseInt(x, 10));
  if (gameVersion.some((d) => isNaN(d))) return 0;
  if (gameVersion[0] > toVersion[0]) return 3;
  else if (gameVersion[0] < toVersion[0]) return 1;
  else if (gameVersion[1] > toVersion[1]) return 3;
  else if (gameVersion[1] < toVersion[1]) return 1;
  else if (gameVersion[2] > toVersion[2]) return 3;
  else if (gameVersion[2] < toVersion[2]) return 1;
  else return 2;
}
export const themeRotation = {
  light: "dark",
  dark: "light",
};
export default {
  name: "App",
  components: {
    Game,
    Notification,
  },
  data() {
    return {
      theme: "light",
      initialGameData: {},
    };
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
    currentInitialGameData() {
      return this.initialGameData;
    },
  },
  mounted() {
    const decrypt = (data) => {
      return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    };
    let data;
    try {
      data = JSON.parse(decrypt(localStorage.getItem("ita-data")));
    } catch (e) {
      data = {};
    }
    let newData = false;
    const oldVersion = data ? data.version : undefined;
    let updated = false;
    if (oldVersion && isVersion(oldVersion, "0.1.0") === 1) {
      data = versions[currentVersion];
      updated = true;
      showNotification(
        "The game has been updated with new balances. Unfortunately this means game data was reset.",
        8000
      );
      showNotification(
        "I hope this isn't too much of an inconvenience. It should only take 40m to get back to completing the game.",
        9000
      );
      showNotification(
        "I hope you can enjoy the game again. Thank you for playing.",
        8000
      );
    } else {
      if (!oldVersion) {
        data = versions[currentVersion];
        newData = true;
      } else data = normaliseVersion(data, currentVersion);
      if (!newData && isVersion(oldVersion, currentVersion) === 1) {
        updated = true;
        showNotification(
          `Local game data found with an outdated version. Your save file has been updated!\nv${oldVersion} -> v${currentVersion}`
        );
      }
      if (!updated && oldVersion)
        showNotification(
          `Local game data found. Loading version ${
            updated ? currentVersion : oldVersion
          }`
        );
    }
    // load game data
    this.theme = data.theme;
    this.initialGameData = {
      generalData: {
        version: updated || !oldVersion ? currentVersion : oldVersion,
        new: newData,
        mobile: false,
        lastReset: data.lastReset,
      },
      tick: data.tick,
      gameData: data.gameData,
      gameStats: data.gameStats,
    };
  },
  methods: {
    changeTheme() {
      this.theme = themeRotation[this.theme] || "light";
    },
  },
};
</script>
