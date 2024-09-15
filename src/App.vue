<script lang="ts">
import { useRouter } from 'vue-router'
import { ref,computed,onMounted } from 'vue';
import {checkSessionValidity} from '@/services/sessionServices';
import { useUserSTore } from '@/stores/user';
import { useNotifStore } from '@/stores/notifications';
import {useSessionStore} from '@/stores/session'
import {logUserOut} from '@/services/loginServices'
import {useKeyStore} from '@/stores/userDetails';
import { fetchNotifications } from './services/notificationsServices';
import { useAuthStore } from './stores/auth';
import { useTranslation } from 'i18next-vue';
import { fetchToken } from './services/tokenService';

export default {
  created () {
  },
    setup() {

      const drawer =ref(true);
      const router=useRouter();
      const userStore=useUserSTore();
      const authStore=useAuthStore();
      const credentialsStore=useKeyStore();
      const sessionStore=useSessionStore();
      const notifcationsStore=useNotifStore();
      const pageLoading=ref(false);
      const {i18next}=useTranslation();

      const username=computed(()=>userStore.getUsername)
      const auth=computed(()=>authStore.getCredential)
      const session=computed(()=>sessionStore.getSession)
      const credentials=computed(()=>credentialsStore.getUserInfos)
      const notifications:any=computed(()=>notifcationsStore.getContent)
     

      const avatar=computed(()=>{
        let calculatedAvatar='';
        if(credentials.value!=null){
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
        const response=await logUserOut(username.value,auth.value)
        if(response.status==200){
          userStore.reset()
          authStore.reset()
          sessionStore.reset()
          credentialsStore.reset()
          notifcationsStore.reset()
          localStorage.removeItem("token")
          router.push('/login')
        }else{
          alert('erreur')
          // je dois afficher un snackbar ici
        }
      }
      
      function moveTowardNotifications(){
        if(session.value){
          router.push({ name: 'notifications', params: { notifications: notifications } })
        }else{
          router.push("/login")
        }
      }
      function moveTo(route:string){
        if(session.value){
          router.push(route)
        }else{
          router.push("/login")
        }
      }
      function changeLanguage(lang:string){
        i18next.changeLanguage(lang);
      }
      
      onMounted(async ()=>{
        console.log("************ %s *********** with parameters: %s , %s", "App mounted", username.value,auth.value)
        
        pageLoading.value=true;
        if(username.value && auth.value){

          const token=await fetchToken(auth.value);
          console.log("The token used is: >>>",token);
          const session=await checkSessionValidity(username.value,auth.value);
          console.log("The session is :",session)

          if(session!=undefined && session.status==200){
            const notificationsResponse=await fetchNotifications(username.value,auth.value);
            notifcationsStore.setContent(notificationsResponse);
            sessionStore.setSession(true)
            router.push('/')
          }else{
            sessionStore.setSession(false)
            userStore.reset();
            authStore.reset();
            credentialsStore.reset();
            notifcationsStore.reset();
            localStorage.removeItem("token");
            router.push('/login')
          }
        }else{
          router.push("/login")
        }
        pageLoading.value=false;

      })

      // expose to template and other options API hooks
      return {
        username,
        credentials,
        drawer,
        userStore,
        session,
        avatar,
        logout,
        notifications,
        pageLoading,
        router,
        moveTowardNotifications,
        moveTo,
        changeLanguage,
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
              {{$t("navigation.deconnect")}}
            </v-btn>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item 
            key="order"
            prepend-icon="mdi-seed-plus-outline" 
            @click="moveTo('/order')"
            value="order">
           {{ $t('navigation.order')}}
          </v-list-item>
          <v-list-item 
            key="dashboard"
            prepend-icon="mdi-view-dashboard" 
            @click="moveTo('/dashboard')"
            value="dashboard">
            {{$t("navigation.dashboard")}}
          </v-list-item>
          <v-list-item 
            key="reports"
            prepend-icon="mdi-chart-arc" 
            @click="moveTo('/reports')"
            value="reports">
            {{$t("navigation.reports")}}
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
          @click="moveTo('/')"
          append-icon="mdi-road-variant"
        >
          {{ $t("UI.appName") }}
        </v-btn>
      </v-app-bar-title>
      <v-btn icon v-if="notifications&&notifications.length>0" @click="moveTowardNotifications()" >
        <v-badge color="deep-orange" :content="notifications.length">
          <v-icon color="deep-purple-lighten-5">mdi-bell</v-icon>
        </v-badge> 
      </v-btn> 
      <v-spacer></v-spacer>  
      <v-menu>
        <template v-slot:activator="{props}">
            <div v-bind="props" class="avatar">
              <v-img
                :width="20"
                :height="17"
                cover
                :src="$i18next.language+'.png'"
              ></v-img>
            </div>
        </template>
        <v-list>
          <v-list-item
            :key="1"
            :value="1"
          >
            <div @click="changeLanguage('fr')" class="d-flex align-center justify-center">
              <p class="mr-2">Français</p>
              <v-img
                :width="20"
                :height="17"
                cover
                src="fr.png"
              ></v-img>
            </div>
          </v-list-item>
          <v-list-item
            :key="2"
            :value="2"
          >
            <div @click="changeLanguage('en')" class="d-flex align-center justify-center">
                <p class="mr-2">Anglais</p>
                <v-img
                  :width="20"
                  :height="17"
                  cover
                  src="en.png"
                ></v-img>
              </div>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>  
      <v-menu v-if="session">
        <template v-slot:activator="{props}">
          <v-avatar v-bind="props" color="white" class="mr-1 avatar" >
            <span class="text-h6">{{ avatar }}</span>
          </v-avatar>
        </template>
        <v-list>
            <v-list-item
              :key="1"
              :value="1"
              prepend-icon="mdi-account-badge"
              @click="moveTo('/account')"

            >
              <v-list-item-title>{{ $t('navigation.account') }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              :key="2"
              :value="2"
              prepend-icon="mdi-rss"
              :link="true"
              @click="moveTo('/feedback')"

            >
              <v-list-item-title >{{ $t('navigation.feedback') }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              :key="2"
              :value="2"
              prepend-icon="mdi-lock"
              :link="true"
              @click="moveTo('/password')"

            >
              <v-list-item-title >{{ $t('navigation.password') }}</v-list-item-title>
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
.avatar{
  cursor: pointer;
}
</style>