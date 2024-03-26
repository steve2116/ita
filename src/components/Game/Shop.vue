<template>
  <div class="container">
    <h2>Improve yourself</h2>
    <p>{{ ownedItems.length }} / {{ Object.keys(items).length }} bought</p>
    <div class="shop">
      <div
        class="shop-item"
        v-for="[name, item] in Object.entries(items)"
        v-show="
          Object.entries(item.view).every(
            ([type, value]) => skills[type] >= value
          )
        "
      >
        <button
          :class="buttonStyle(name)"
          @click="() => buttonClick(name, item)"
          @touchstart="() => buttonTouch(name, item)"
          v-on:mouseenter="changeShowHover(name, 'button')"
          v-on:mouseleave="changeShowHover(name, 'button', false, false)"
          v-on:focus="changeShowHover(name, 'button', true)"
          v-on:blur="unShowHover(name, false)"
          :disabled="ownedItems.includes(name)"
        >
          {{ item.name }}
        </button>
        <div
          v-show="Object.values(showHover[name]).some((x) => x)"
          :class="hoverStyle"
          @click="() => unShowHover(name)"
          @touchend="() => unShowHover(name, false)"
          v-on:mouseenter="changeShowHover(name, 'hover')"
          v-on:mouseleave="changeShowHover(name, 'hover', false, false)"
        >
          <template v-if="ownedItems.includes(name)" />
          <template
            v-else-if="
              Object.entries(item.unlock).every(
                ([type, value]) => skills[type] >= value
              )
            "
          >
            <p>Costs:</p>
            <template v-for="[type, value] in Object.entries(item.price)">
              <p>{{ numberAsReadable(value) }} {{ type }}</p>
            </template>
          </template>
          <template v-else>
            <p>Unlocked at:</p>
            <template v-for="[type, value] in Object.entries(item.unlock)">
              <p v-if="skills[type] < value">
                {{ numberAsReadable(value) }} {{ type }}
              </p>
              <template v-else />
            </template>
          </template>
          <p>{{ item.description }}</p>
          <p>Effects: {{ item.effect }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showNotification } from "../../elements";
import { numberAsReadable } from "../../utils";
export default {
  name: "Shop",
  props: {
    theme: {
      type: String,
      required: true,
    },
    ownedItems: {
      type: Array,
      required: true,
    },
    skills: {
      type: Object,
      required: true,
    },
    mobileRef: {
      type: Object,
      required: true,
    },
    beat: {
      type: Object,
      required: true,
    },
  },
  data() {
    // const /** @type {{ [itemName: string]: {
    const /** @type {{ [itemName in 'lungs-1']: {
       * name: string,
       * view: { [type: string]: number },
       * unlock: { [type: string]: number },
       * price: { [type: string]: number },
       * description: string, effect: string
       * }}}
       */
      items = {
        "lungs-1": {
          name: "Practiced breaths",
          view: {},
          unlock: { air: 20 },
          price: { energy: 100 },
          description:
            "Through repeated practice, you have gotten better at controlling your lungs.",
          effect: "Air gain +10%. Air cost -2e",
        },
        "lungs-2": {
          name: "Deep breaths",
          view: { air: 20 },
          unlock: { air: 35 },
          price: { energy: 750 },
          description:
            "You have learned to take deep breaths, allowing you to absorb more air.",
          effect: "Air gain +30%. Air cost -3e",
        },
        "lungs-3": {
          name: "Efficient breaths",
          view: { air: 50 },
          unlock: { air: 85 },
          price: { energy: 6500 },
          description:
            "You have learned to take efficient breaths, allowing you to absorb even more air.",
          effect: "Air gain +50%. Air cost -3e",
        },
        "lungs-4": {
          name: "Breathing techniques",
          view: { air: 100 },
          unlock: { air: 130, flora: 2 },
          price: { energy: 10000 },
          description:
            "As you start noticing the fauna around you more, you observe how they breathe.",
          effect: "Air gain +75%. Air softcap x1.2",
        },
        "lungs-5": {
          name: "Breathing mastery",
          view: { air: 250, flora: 3 },
          unlock: { air: 450, flora: 7 },
          price: { energy: 50000 },
          description:
            "Breathing has become natural to you, you don't even have to think about it.",
          effect: "Air gain +125%. Air softcap x2",
        },
        "lungs-6": {
          name: "Advanced breathing",
          view: { air: 1000, flora: 3 },
          unlock: { air: 1500, flora: 7, rodent: 2 },
          price: { energy: 2000000 },
          description:
            "After catching your first prey, you have learned to make each breath count.",
          effect: "Air gain +200%. Air softcap exponent +0.02",
        },
        "lungs-7": {
          name: "Basic breathing",
          view: { air: 2000, flora: 3 },
          unlock: { air: 3500, flora: 30, rodent: 5 },
          price: { energy: 5000000 },
          description: "Back to the basics. Breathe in, breathe out.",
          effect:
            "Air gain +300%. Air softcap x2.5. Air softcap exponent +0.03",
        },
        "nose-1": {
          name: "Sensitive nose",
          view: { flora: 1 },
          unlock: { flora: 3 },
          price: { energy: 15000 },
          description:
            "You have developed a sensitive nose, allowing you to detect more flora.",
          effect: "Flora gain +20%. Flora cost -150e",
        },
        "nose-2": {
          name: "Discerning nose",
          view: { flora: 4 },
          unlock: { flora: 5 },
          price: { energy: 35000 },
          description:
            "You have developed a discerning nose, allowing you to detect even more flora.",
          effect: "Flora gain +50%. Flora cost -200e",
        },
        "nose-3": {
          name: "Discriminating nose",
          view: { air: 350, flora: 6 },
          unlock: { flora: 9 },
          price: { energy: 100000 },
          description:
            "You have developed a discriminating nose, enabling you to discern most flora between each other.",
          effect: "Flora gain +90%. Flora cost -250e",
        },
        "nose-4": {
          name: "Expanded olfactory receptors",
          view: { air: 800, flora: 12 },
          unlock: { flora: 15 },
          price: { energy: 300000 },
          description:
            "Your exposure to the local flora has increased the number of smells you can recognise.",
          effect: "Air softcap x1.25. Flora gain +150%",
        },
        "nose-5": {
          name: "Big nose",
          view: { air: 1200, flora: 20 },
          unlock: { flora: 25, rodent: 2 },
          price: { energy: 3500000 },
          description: "Bigger nose -> more smells.",
          effect: "Air softcap x1.35. Flora gain +220%",
        },
        "claws-1": {
          name: "Longer nails",
          view: { flora: 16, rodent: 1 },
          unlock: { flora: 20, rodent: 2 },
          price: { energy: 500000 },
          description:
            "Having seen other animals use their claws when hunting, you decide to grow yours out.",
          effect: "Rodent gain +10%. Rodent cost -50,000e",
        },
        "claws-2": {
          name: "Sharper nails",
          view: { flora: 16, rodent: 2 },
          unlock: { flora: 20, rodent: 4 },
          price: { energy: 10000000 },
          description:
            "Having seen the effectiveness of longer claws, you sharpen them as well.",
          effect: "Rodent gain +20%. Rodent cost -50,000e",
        },
        "mouth-1": {
          name: "Dual passageway",
          view: { air: 600, flora: 10 },
          unlock: { air: 750, flora: 12, rodent: 1 },
          price: { energy: 200000 },
          description:
            "Through exerting effort to search for food, you have realised you can breathe through your mouth as well as your nose.",
          effect: "Air gain x1.1. Air softcap x1.5. Flora gain x1.1",
        },
        // 930 air, 15 flora, 1 rodent
        "exist-1": {
          name: "Increased presence",
          view: { air: 1, flora: 1, rodent: 1 },
          unlock: { air: 1, flora: 1, rodent: 1 },
          price: { energy: 500000 },
          description:
            "As you enjoy feeling your existence in this world, you can sense yourself begin to assert your presence on your surroundings.",
          effect:
            "Your experiences help you assert yourself upon your surroundings",
        },
      };
    return {
      items,
      showHover: Object.keys(items).reduce(
        (acc, key) => ({ ...acc, [key]: { button: false, hover: false } }),
        {}
      ),
    };
  },
  computed: {
    buttonStyle() {
      const { ownedItems } = this;
      return (name) => {
        return ownedItems.includes(name)
          ? {
              "light-button-shop-2": this.theme === "light",
              "dark-button-shop-2": this.theme === "dark",
            }
          : {
              "light-button-shop-1": this.theme === "light",
              "dark-button-shop-1": this.theme === "dark",
            };
      };
    },
    hoverStyle() {
      return {
        "hover-box": true,
        "light-border-1": this.theme === "light",
        "dark-border-1": this.theme === "dark",
        "light-shop-hover": this.theme === "light",
        "dark-shop-hover": this.theme === "dark",
      };
    },
  },
  methods: {
    numberAsReadable,
    changeShowHover(name, type, touch = true, value = true) {
      if (!touch || !this.mobileRef.isMobile)
        this.showHover[name][type] = value;
    },
    unShowHover(name, touch = true) {
      if (!touch || !this.mobileRef.isMobile) {
        const { showHover } = this;
        Object.keys(showHover[name]).forEach(
          (key) => (showHover[name][key] = false)
        );
      }
    },
    buttonClick(name, item) {
      if (
        !this.mobileRef.isMobile &&
        Object.values(this.showHover[name]).some((x) => x)
      )
        this.$emit("purchase", {
          name,
          price: item.price,
          unlock: item.unlock,
        });
    },
    buttonTouch(name, item) {
      this.mobileRef.mobile();
      if (this.showHover[name].button) {
        this.$emit("purchase", {
          name,
          price: item.price,
          unlock: item.unlock,
        });
      } else this.showHover[name].button = true;
    },
  },
  emits: ["purchase"],
  mounted() {
    if (!this.beat.val) {
      const timer = setInterval(() => {
        if (this.ownedItems.includes("exist-1")) {
          clearInterval(timer);
          this.beat.val = true;
          showNotification(
            "You have exerted your existence on the world! Congratulations!",
            6500
          );
          showNotification(
            "For now this is the end of the game, but feel free to keep playing!",
            6500
          );
          showNotification(
            "The next update will include a prestige system, so please be aware that most progress will be reset upon prestiging.",
            12000
          );
          showNotification("Thanks for playing!", 7000);
        }
      }, 500);
    }
  },
};
</script>

<style scoped>
button {
  box-sizing: content-box;
  height: calc(var(--un) * 10);
  width: calc(var(--un) * 20);
  margin: calc(var(--un) * 0.2);
  padding: calc(var(--un) * 1);
  border-radius: calc(var(--un) * 5);
  font-size: 1.15rem;
  cursor: pointer;
}
.shop {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.hover-box {
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
</style>
