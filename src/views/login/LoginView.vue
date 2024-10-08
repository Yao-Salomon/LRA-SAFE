<script lang="ts">
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import {logUserIn} from '@/services/loginServices';
    import { useSessionStore } from '@/stores/session';
    import {useKeyStore} from '@/stores/userDetails';
    import { useUserSTore } from '@/stores/user';
    import {useTranslation} from "i18next-vue";
    import { fetchNotifications } from '@/services/notificationsServices';
    import { useNotifStore } from '@/stores/notifications';
    import { useAuthStore } from '@/stores/auth';

export default{
    created () {
    },
    setup(){
        const form:any=ref(null)
        const router=useRouter()
        const {i18next,t}=useTranslation();

        const userStore=useUserSTore()
        const authStore=useAuthStore()
        const credentialsStore=useKeyStore()
        const sessionStore=useSessionStore()
        const notifcationsStore=useNotifStore();


        const username=ref("")
        const password=ref("")
        const passwordVisible=ref(true)
        const badCredentials=ref(false)
        const type=ref("password")
        const loggingIn=ref(false)
        const snackBarVisibility=ref(false)
        const snackBarText=ref('')

        function toggleMarker(){
            passwordVisible.value=!passwordVisible.value
            if(type.value==""){
                type.value="password"
            }else{
                type.value=""
            }
        }
        onMounted(()=>{
            console.log("************ %s *********** with language: %s", "Login Mounted",i18next.language)
        })


        function navigateToRoute(route:string){
            router.push(route);
        }
        async function validateForm(){
            const {valid}=await form.value.validate()
            if(valid){
                loggingIn.value=true
                const serviceResponse=await logUserIn(username.value,password.value)
                
                if(serviceResponse.status==200){
                    console.log("The username: ",serviceResponse.user.username)
                    badCredentials.value=false
                    userStore.setUsername(serviceResponse.user.username)
                    credentialsStore.setUserInfos(serviceResponse.user)
                    sessionStore.setSession(true)
                    authStore.setCredential(serviceResponse.authCredential)
                    loggingIn.value=false
                    const notificationsResponse=await fetchNotifications(username.value,serviceResponse.authCredential);
                    notifcationsStore.setContent(notificationsResponse)
                    router.push('/')
                }else{
                    badCredentials.value=true;
                    loggingIn.value=false;
                    snackBarText.value=t("forms.badCredentials");
                    snackBarVisibility.value=true;
                    userStore.reset();
                    credentialsStore.reset();
                    authStore.reset();
                }
           }
        }
        return{
            username,
            passwordVisible,
            password,
            type,
            toggleMarker,
            validateForm,
            form,
            navigateToRoute,
            badCredentials,
            loggingIn,
            snackBarText,
            snackBarVisibility
        }
    }
    
}
</script>

<template>
    <v-sheet
        class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4"
        elevation="3"
        height="400"
        rounded
        max-width="600"
        width="100%"
    >
    <v-card class="mr-1 bg-blue-accent-1 my-2" elevation="5">
        <v-img
            width="130"
            height="380"
            cover
            lazy-src="./src/assets/road2.jpg"
            src="./src/assets/road2.jpg"
        >
            <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                    color="grey-lighten-4"
                    indeterminate
                    ></v-progress-circular>
                </div>
            </template>
        </v-img>
    </v-card>

    <v-card class="mx-auto w-75 px-4 py-3" elevation="1">
        <div class="py-3 mb-2 pl-2 d-flex">
            <v-img
                height="25"
                aspect-ratio="1"
                src="./src/assets/logo.png"
            ></v-img>
        </div>
        <v-form class="" ref="form">
            <v-text-field
                class="mb-2 w-100"
                clearable
                v-model="username"
                :label="$t('forms.username')"
                placeholder="Enter your username"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                :rules="[(v:any)=>!!v||$t('alerts.usernameRequired')]"
                required
                :onkeydown="(event:any)=>{
                   if(event.code=='Enter'){
                    validateForm()
                   }
                }"
            ></v-text-field>

            <v-text-field
                clearable
                :type="type"
                v-model="password"
                :label="$t('forms.password')"
                :rules="[(v:any)=>!!v||$t('alerts.passwordRequired')]"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="passwordVisible?'mdi-eye-outline':'mdi-eye-off-outline'"
                placeholder="Enter your password"
                variant="outlined"
                @click:append-inner="toggleMarker"
                :onkeydown="(event:any)=>{
                   if(event.code=='Enter'){
                    validateForm()
                   }
                }"
            ></v-text-field>

            <br>
            <v-progress-linear
            color="deep-purple-accent-4"
            class="mb-1"
            :active="loggingIn"
            :indeterminate="loggingIn"
            absolute
            bottom
            rounded
            height="5"
          ></v-progress-linear>
            <v-btn
                block
                color="success"
                size="large"
                @click="validateForm"
                variant="elevated"
                prepend-icon="mdi-login"
            >
                {{ $t('forms.signInButton') }}
            </v-btn>
            <div class="d-flex justify-center align-center mt-5">
                <span class="mr-2 font-weight-bold">{{ $t('forms.noAccount') }}</span>
                <v-btn
                    variant="tonal"
                    class=""
                    color="indigo"
                    prepend-icon="mdi-account-multiple-plus-outline"
                    @click="navigateToRoute('/signup')"
                >
                    {{ $t('forms.signUpButton') }}
                </v-btn>
            </div>
        </v-form>
    </v-card>
    
    <v-snackbar
      v-model="snackBarVisibility"
      multi-line
      :timeout="4000"
      elevation="5"
      color="white"
    >
      {{ snackBarText }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="snackBarVisibility = false"
        >
          {{$t("forms.closeCaption")}}
        </v-btn>
      </template>
    </v-snackbar>
    </v-sheet>
</template>