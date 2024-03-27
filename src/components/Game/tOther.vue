<template>
  <h2>Info</h2>
  <p>The game takes 35 minutes to fully complete.</p>
  <p>Updates will not be frequent but will be coming. Any ideas are welcome!</p>
  <p>My first attempt at making a game. I hope you enjoy it!</p>
  <br />
  <h2>Change Log</h2>
  <h4>v0.1.0</h4>
  <p>First update where I consider this an actual game.</p>
  <p>
    Balance changes, more evolutions, a change log, proper usage of versioning,
    and most annoyingly a data reset - although the game isn't too long so
    hopefully that's not an issue.
  </p>
  <br />
  <h2>Credits</h2>
  <p>Me: on Discord and Github as [ steve2116 ]</p>
</template>

<script>
export default {
  name: "Othert",
  props: {
    theme: {
      type: String,
      required: true,
    },
  },
};
</script>
