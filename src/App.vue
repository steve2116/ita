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
        :initial-game-data="currentInitialGameData"
        @change-theme="changeTheme"
      />
    </div>
  </div>
</template>

<script>
import Game from "./components/Game.vue";

import CryptoJS from "crypto-js";

const currentVersion = "0.0.3";
export const versions = {
  "0.0.3": {
    version: "0.0.3",
    theme: "light",
    tick: {
      tickRate: 250,
    },
    gameData: {
      resources: {
        energy: 0,
        mass: -1,
      },
      skills: {
        air: -1,
        flora: -1,
        rodent: -1,
      },
      skillTicks: {
        air: 0,
        flora: 0,
        rodent: 0,
      },
    },
  },
  "0.0.2": {
    version: "0.0.2",
    theme: "light",
    tick: {
      tickRate: 250,
    },
    gameData: {
      resources: {
        energy: 0,
        mass: -1,
      },
      skills: {
        air: -1,
        flora: -1,
        rodent: -1,
      },
    },
  },
  "0.0.1": {
    version: "0.0.1",
    theme: "light",
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
    case "0.0.2": {
      return updateSaveVersion(
        {
          ...gameData,
          version: "0.0.3",
          gameData: {
            ...gameData.gameData,
            skillTicks: {
              air: 0,
              flora: 0,
              rodent: 0,
            },
          },
        },
        to
      );
    }
    case "0.0.1": {
      return updateSaveVersion(
        {
          ...versions["0.0.2"],
          theme: gameData.theme,
        },
        to
      );
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
    case "0.0.3": {
      const tempGameData = { ...gameData, version: "0.0.2" };
      delete tempGameData.gameData.skillTicks;
      return downdateSaveVersion(tempGameData, to);
    }
    case "0.0.2": {
      return {
        version: "0.0.1",
        theme: gameData.theme,
      };
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
    if (!oldVersion) {
      data = versions[currentVersion];
      newData = true;
    } else data = normaliseVersion(data, currentVersion);
    console.log(
      `loaded game data with version ${oldVersion || "[data not found]"}`
    );
    if (!newData && oldVersion !== currentVersion)
      console.log(
        `A more recent version is available! Please update your file in settings.`
      );
    // load game data
    this.theme = data.theme;
    this.initialGameData = {
      generalData: {
        version: oldVersion || currentVersion,
        new: newData,
      },
      tick: data.tick,
      gameData: data.gameData,
    };
  },
  methods: {
    changeTheme() {
      this.theme = themeRotation[this.theme] || "light";
    },
  },
};
</script>
