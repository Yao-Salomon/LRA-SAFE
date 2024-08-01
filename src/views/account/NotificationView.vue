<script lang="ts">
    import { fetchNotifications, markAsReadOrArchived } from '@/services/notificationsServices';
import { useUserSTore } from '@/stores/user';
import { useNotifStore } from '@/stores/notifications';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
    export default{
        setup(){

            const route=useRoute();
            const userStore=useUserSTore();
            const authStore=useAuthStore();
            const notifcationsStore=useNotifStore();

            const pageLoading=ref(true);
            const snackbar=ref(false)
            const snackbarText=ref('')

            const username=computed(()=>userStore.getUsername);
            const auth=computed(()=>authStore.getCredential);

            const notifications:any=computed(()=>notifcationsStore.getContent)

            async function treatNotifications(notificationId:any,markAsRead:any){
                const response=await markAsReadOrArchived(notificationId,markAsRead,auth.value)
                snackbar.value=true
                snackbarText.value=response.message
                pageLoading.value=true
                const notificationsResponse=await fetchNotifications(username.value,auth.value);
                notifcationsStore.setContent(notificationsResponse);
                pageLoading.value=false;
            }

            onMounted(async ()=>{
                const notificationsResponse=await fetchNotifications(username.value,auth.value);
                notifcationsStore.setContent(notificationsResponse);
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
    <v-sheet class=" pa-2 rounded-lg mb-5" width="80%" height="100%" v-else>
        <p class="text-center text-h6 mb-2 font-weight-bold d-flex flex-column justify-center align-center">
            <v-icon icon="mdi-message-badge" color="blue"/>
        </p>

        <div v-if="notifications.length>0">
            <v-list>
                <v-divider></v-divider>
                <v-list-item
                    v-for="notification in notifications"
                    :key="notification.id"
                    :subtitle="notification.message"
                    :title="notification.title"
                >
                    <template v-slot:prepend>
                    <v-avatar :color="notification.color">
                        <v-icon color="white" :icon="'mdi-'+notification.icon"></v-icon>
                    </v-avatar>
                    </template>

                    <template v-slot:append>
                        <v-btn
                            color="green"
                            icon="mdi-message-check"
                            variant="text"
                            @click="treatNotifications(notification.id,true)"
                        ></v-btn>
                        <v-btn
                            color="red"
                            icon="mdi-delete"
                            variant="text"
                            @click="treatNotifications(notification.id,true)"
                        ></v-btn>
                    </template>
                </v-list-item>
                <v-divider></v-divider>
            </v-list>
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