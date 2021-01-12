<template>
  <!-- <Task /> -->
  <!-- <Layout />
   -->
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
});
</script>

<style>
html,
body {
  margin: 0 0;
  padding: 0 0;
  height: 100%;
  background-color: #f6f6f6;
}
.el-message-box__wrapper {
  z-index: 2999 !important;
}
#app {
  height: 100%;
}
</style>
