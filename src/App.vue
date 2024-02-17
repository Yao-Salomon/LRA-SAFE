<script lang="ts">
import { RouterLink, RouterView,useRouter } from 'vue-router'
import { ref,computed,onMounted } from 'vue';
import {checkSessionValidity} from './services/sessionServices';
import { useTokenStore } from './stores/token';
import { useUserSTore } from './stores/user';
import {useSessionStore} from './stores/session'


export default {
  created () {
  },
    setup() {
      const drawer =ref(true);
      const router=useRouter();

      const userStore=useUserSTore();
      const tokenStore=useTokenStore();
      const sessionStore=useSessionStore();

      const tokenJson=computed(()=>tokenStore.getToken)
      const username=computed(()=>userStore.getUsername)
      const session=computed(()=>sessionStore.getSession)

      onMounted(()=>{
        checkSessionValidity(username.value)
      })

      // expose to template and other options API hooks
      return {
        username,
        drawer,
        tokenJson,
        userStore,
        session
      }
    },

    mounted() {
      
    },
  }
</script>

<template>

  <v-app>
    <v-app-bar :elevation="1" rounded color="primary" >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      
      <v-app-bar-title>Labpro</v-app-bar-title>
      <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>

        <v-btn @click.stop="" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="session" v-model="drawer" expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-sheet class="d-flex align-center justify-center w-100 h-screen bg-light-blue-accent-4" style="background-image: url('./src/assets/road1.jpg'); background-size: contain;">
      <RouterView/>
    </v-sheet>
    <v-sheet >

    </v-sheet>
  </v-app>
</template>