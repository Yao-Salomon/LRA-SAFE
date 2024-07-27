<script lang="ts">
  import { computed,onMounted } from 'vue';
  import Timeline from '../components/TimeLine.vue'
  import {checkSessionValidity} from '@/services/sessionServices';
  import { useUserSTore } from '@/stores/user';



  export default{
    setup(){
      const userStore=useUserSTore();
      const username=computed(()=>userStore.getUsername)

      onMounted(async ()=>{
        checkSessionValidity(username.value)
        console.log("The username :"+username.value)
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
