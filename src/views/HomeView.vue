<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import Timeline from '../components/TimeLine.vue'

</script>

<template>
  <v-sheet
    class="bg-blue"
    width="100%"
    height="100%"
    style="background-image: url('./src/assets/slide-4.jpg');background-size: cover;"
  >
    <Timeline/>

  </v-sheet>
</template>

<style>
  .overdrop{
    background-color: #ffffffa1;
  }
</style>
