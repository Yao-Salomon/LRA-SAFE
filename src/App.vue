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
      const avatar=username.value.charAt(0).toUpperCase()

      onMounted(()=>{
        checkSessionValidity(username.value)
      })

      // expose to template and other options API hooks
      return {
        username,
        drawer,
        tokenJson,
        userStore,
        session,
        avatar
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
        <v-menu v-if="session">
          <template v-slot:activator="{props}">
            <v-avatar v-bind="props" id="avatar" color="red" class="mr-1" >
              <span class="text-h5">{{ avatar }}</span>
            </v-avatar>
          </template>
          <v-list>
              <v-list-item
                :key="1"
                :value="1"
                prepend-icon="mdi-account-badge"
                to="/account"
              >
                <v-list-item-title>{{ $t('navigation.account') }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item
                :key="2"
                :value="2"
                prepend-icon="mdi-rss"
                :link="true"
                to="/feedback"
              >
                <v-list-item-title >{{ $t('navigation.feedback') }}</v-list-item-title>
              </v-list-item>
            </v-list>
        </v-menu>
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

<style>
#avatar{
  cursor: pointer;
}
</style>