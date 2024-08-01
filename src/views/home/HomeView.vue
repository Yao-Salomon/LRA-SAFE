<script lang="ts">
  import { onMounted } from 'vue';
  import Timeline from '../../components/TimeLine.vue'


  export default{
    setup(){

      onMounted(async ()=>{
        console.log("************ %s ***********", "HomeView mounted")
       
      })
      return{
        
      }

    },
    components:{
      Timeline
    }
    
  }
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
