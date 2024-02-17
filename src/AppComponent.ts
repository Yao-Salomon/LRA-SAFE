import { RouterLink } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref,computed } from 'vue';

export default {
  created () {
  },
    setup() {
      const drawer =ref(true);
      const token=ref(true);

      // expose to template and other options API hooks
      return {
        drawer
      }
    },

    mounted() {
      
    }
  }