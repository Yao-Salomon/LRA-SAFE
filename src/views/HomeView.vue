<script setup lang="ts">
  import TheWelcome from '../components/TheWelcome.vue'
  import Timeline from '../components/TimeLine.vue'

</script>

<template>
  <v-sheet
    class="bg-blue"
    width="100%"
    height="100%"
    
  >
    <v-carousel
      progress="green"
      cycle
      hide-delimiter-background
      :show-arrows="false"
      hide-delimiters
    >
      <v-carousel-item
        src="./src/assets/slide-4.jpg"
        cover
      >
        <Timeline/>
      </v-carousel-item> 
    </v-carousel>

  </v-sheet>
</template>

<style>
  .overdrop{
    background-color: #ffffffa1;
  }
</style>
