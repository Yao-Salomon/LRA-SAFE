<script lang="ts">
import { RouterLink, RouterView,useRouter,useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref,computed,onMounted } from 'vue';
import {checkSessionValidity} from '@/services/sessionServices';
import { useTokenStore } from '@/stores/token';
import { useUserSTore } from '@/stores/user';
import { useNotifStore } from '@/stores/notifications';
import {useSessionStore} from '@/stores/session'
import {logUserOut} from '@/services/loginServices'
import {useKeyStore} from '@/stores/userDetails';
import { fetchNotifications } from './services/notificationsServices';
import { onUpdated } from 'vue';
import { onBeforeUpdate } from 'vue';


export default {
  created () {
  },
    setup() {

      const drawer =ref(true);
      const location=useRoute()
      const router=useRouter();
      const userStore=useUserSTore();
      const credentialsStore=useKeyStore();
      const tokenStore=useTokenStore();
      const sessionStore=useSessionStore();
      const notifcationsStore=useNotifStore();
      const pageLoading=ref(false);


      const tokenJson=computed(()=>tokenStore.getToken)
      const username=computed(()=>userStore.getUsername)
      const session=computed(()=>sessionStore.getSession)
      const credentials=computed(()=>credentialsStore.getUserInfos)
     const notifications=computed(()=>notifcationsStore.getContent)
     

      const avatar=computed(()=>{
        let calculatedAvatar='';
        if(credentials!=null){
          if(Object.keys(credentials).length>0){
            if(credentials.value.firstName!=undefined){
              calculatedAvatar+=credentials.value.firstName.charAt(0);
            }
            if(credentials.value.lastName!=undefined){
              calculatedAvatar+=credentials.value.lastName.charAt(0)
            }
            if(credentials.value.firstName==undefined || credentials.value.lastName==undefined){
              calculatedAvatar==username.value.charAt(0)
            }

          }
        }
        return calculatedAvatar;
      })

      async function logout(){
        const response=await logUserOut(username.value)
        if(response.status==200){
          userStore.reset()
          sessionStore.reset()
          credentialsStore.reset()
          notifcationsStore.reset()
          router.push('/login')
        }else{
          alert('erreur')
          // je dois afficher un snackar ici
        }
      }
      
      
      onMounted(async ()=>{
        pageLoading.value=true;
        checkSessionValidity(username.value)
        console.log("The username :"+username.value)
        console.log("The credentials",credentials.value)

        const notificationsResponse=await fetchNotifications(username.value);
        notifcationsStore.setContent(notificationsResponse)
        pageLoading.value=false;
        console.log("The notifications are : ",notifications.value)
      })

      // expose to template and other options API hooks
      return {
        username,
        credentials,
        drawer,
        tokenJson,
        userStore,
        session,
        avatar,
        logout,
        notifications,
        pageLoading,
        router,
        
      }
    },
  }
</script>

<template>

  <v-app style="background-image: url('./src/assets/road1.jpg'); background-size: contain;">
    <v-navigation-drawer v-if="session" v-model="drawer" expand-on-hover rail>
        <v-list>
          <v-list-item
            :title="credentials.firstName+' '+credentials.lastName"
            :subtitle="credentials.email"
            prepend-icon="mdi-account-tie"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-logout"
          >
            <v-btn
              variant="elevated"
              color="green"
              size="small"
              @click="logout"
            >
              Se déconnecter
            </v-btn>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item 
            key="order"
            prepend-icon="mdi-seed-plus-outline" 
            to="/order" 
            value="order">
           {{ $t('navigation.order')}}
          </v-list-item>
          <v-list-item 
            key="dashboard"
            prepend-icon="mdi-view-dashboard" 
            to="/dashboard" 
            value="dashboard">
           Tableau de bord
          </v-list-item>
          <v-list-item 
            key="reports"
            prepend-icon="mdi-chart-arc" 
            to="/reports" 
            value="reports">
           Rapports & états
          </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar :elevation="1" rounded color="primary" >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>
        <v-btn
          variant="text"
          class=""
          to="/"
          append-icon="mdi-road-variant"
        >
          Labpro
        </v-btn>
      </v-app-bar-title>
      <v-btn icon v-if="notifications.length>0" @click="router.push({ name: 'notifications', params: { notifications: notifications } })" >
        <v-badge color="deep-orange" :content="notifications.length">
          <v-icon color="deep-purple-lighten-5">mdi-bell</v-icon>
        </v-badge> 
      </v-btn> 
      <v-spacer></v-spacer>    
        <v-menu v-if="session">
          <template v-slot:activator="{props}">
            <v-avatar v-bind="props" id="avatar" color="white" class="mr-1" >
              <span class="text-h6">{{ avatar }}</span>
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
    <v-main class="">
      <!-- style="background-image: url('./src/assets/road1.jpg'); background-size: contain;"-->
      <v-sheet class="d-flex align-center justify-center w-100 h-100" v-if="pageLoading">
        <v-skeleton-loader
          class="mx-auto border"
          width="80%"
          type="card-avatar, actions,article"
        ></v-skeleton-loader>
      </v-sheet>
      <v-sheet class="d-flex align-center justify-center w-100 h-100" v-else>
        <RouterView/>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<style>
#avatar{
  cursor: pointer;
}
</style>