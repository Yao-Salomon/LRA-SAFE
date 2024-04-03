<script lang="ts">
    import { fetchNotifications, markAsReadOrArchived } from '@/services/notificationsServices';
import { useUserSTore } from '@/stores/user';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
    export default{
        setup(){

            const route=useRoute();
            const userStore=useUserSTore();
            const pageLoading=ref(true);
            const notifications:any=ref([])
            const snackbar=ref(false)
            const snackbarText=ref('')

            const username=computed(()=>userStore.getUsername);

            async function treatNotifications(notificationId:any,markAsRead:any){
                const response=await markAsReadOrArchived(notificationId,markAsRead)
                snackbar.value=true
                snackbarText.value=response.message
                pageLoading.value=true
                const notificationsResponse=await fetchNotifications(username.value);
                notifications.value=notificationsResponse;
                pageLoading.value=false;
            }

            onMounted(async ()=>{
                const notificationsResponse=await fetchNotifications(username.value);
                notifications.value=notificationsResponse;
                pageLoading.value=false;
            })

            return{
                route,
                pageLoading,
                notifications,
                snackbar,
                snackbarText,
                treatNotifications
            }
        }
    }
</script>

<template>
    <v-snackbar
      v-model="snackbar"
      color="deep-purple-accent-4"
      elevation="24"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
    <v-sheet v-if="pageLoading">
        <v-skeleton-loader
          class="mx-auto border"
          width="80%"
          type="card-avatar, actions,article"
        ></v-skeleton-loader>
    </v-sheet>
    <v-sheet class=" pa-2 rounded-lg mb-5" width="80%" height="90%" v-else>
        <p class="text-center text-h6 mb-2 font-weight-bold d-flex flex-column justify-center align-center">
            <v-icon icon="mdi-message-badge" color="blue"/>
        </p>
        
        <div v-if="notifications.length>0">
            <v-card variant="tonal" class="my-2" color="blue" elevation="1"  v-for="notification in notifications">
                <v-card-text class="text-body-1">
                    {{ notification.message }}
                </v-card-text>
                <v-card-actions>
                    <v-btn color="blue" variant="flat" @click="treatNotifications(notification.id,true)">
                        Marquer comme lu
                    </v-btn>
                    <v-btn color="green" variant="flat" @click="treatNotifications(notification.id,false)">
                        Archiver
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <div v-else class="d-flex flex-column justify-center align-center">
            <p class="text-body-1">Vous n'avez aucune notification</p>
            <v-card class="mt-2" variant="tonal" color="deep-purple" to="/">
                <v-card-actions>
                    <v-card-item>
                        <v-icon icon="mdi-home-silo-outline"/>
                    </v-card-item>
                    <v-btn to="/">
                        Accueil
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        
    </v-sheet>
</template>