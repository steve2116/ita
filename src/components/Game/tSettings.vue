<template>
  <h2>Settings</h2>
  <button
    style="position: absolute; top: -100%; left: -100%"
    @click="$emit('changeTheme')"
  >
    Change Theme
  </button>
</template>

<script>
export default {
  name: "Settingst",
  emits: ["changeTheme"],
};
</script>
