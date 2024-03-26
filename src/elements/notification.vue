<template>
  <div id="notification">
    <div :class="notifStyle">
      <p>
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
let refToNotif = null;
const defaultTime = 5000;
/** @param {string} msg The nofitication to display */
export function showNotification(msg, time = defaultTime) {
  if (!refToNotif) {
    const timer = setInterval(() => {
      if (refToNotif) {
        clearInterval(timer);
        showNotification(msg, time);
      }
    }, 200);
  } else {
    refToNotif.add({ msg, time });
    refToNotif.notify();
  }
}
export default {
  name: "Notification",
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      /** @type {{msg: string, time: number}[]} */
      messages: [],
      message: "",
      showing: false,
    };
  },
  computed: {
    notifStyle() {
      return {
        container: true,
        hide: !this.showing,
        "light-bg-3": this.theme === "light",
        "dark-bg-3": this.theme === "dark",
        "light-border-1": this.theme === "light",
        "dark-border-1": this.theme === "dark",
      };
    },
  },
  mounted() {
    const thisRef = this;
    refToNotif = {
      get messages() {
        return thisRef.messages;
      },
      get current() {
        return thisRef.messages[0] || { msg: "", time: defaultTime };
      },
      add(msg) {
        thisRef.messages.push(msg);
      },
      get show() {
        return thisRef.messages.length > 0;
      },
      notify() {
        if (!thisRef.showing) {
          if (thisRef.messages.length > 0) {
            function showMessage() {
              return new Promise((resolve) => {
                const message = thisRef.messages.shift();
                thisRef.showing = true;
                thisRef.message = message.msg;
                setTimeout(() => {
                  thisRef.showing = false;
                  setTimeout(() => {
                    thisRef.message = "";
                    resolve();
                  }, 750);
                }, message.time);
              });
            }
            (async () => {
              while (thisRef.messages.length > 0) {
                await showMessage();
              }
            })();
          }
        }
      },
    };
  },
};
</script>

<style scoped>
#notification {
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  pointer-events: none;
  z-index: 999;
}
.container {
  position: relative;
  transition: 0.75s ease-in-out;
  --min-width: calc(15rem);
  --potential-width: calc(var(--width-of-app) / 3);
  --actual-width: max(var(--min-width), var(--potential-width));
  top: calc(var(--un) * 4);
  left: calc((var(--width-of-app) / 2) - (var(--actual-width) / 2));
  height: fit-content;
  width: var(--potential-width);
  min-width: var(--min-width);
  text-align: center;
  padding: 0.5rem;
  opacity: 0.9;
  border-radius: 1.5rem;
  font-size: 1.2em;
}
.hide {
  background-color: transparent;
  color: transparent;
  border-color: transparent;
}
</style>
