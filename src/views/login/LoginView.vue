<script lang="ts">
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import {logUserIn} from '../../services/loginServices';

export default{
    created () {
    },
    setup(){
        const form:any=ref(null)
        const router=useRouter()
        const username=ref("")
        const password=ref("")
        const passwordVisible=ref(true)
        const type=ref("password")

        function toggleMarker(){
            passwordVisible.value=!passwordVisible.value
            if(type.value==""){
                type.value="password"
            }else{
                type.value=""
            }
        }
        function navigateToRoute(route:string){
            router.push(route);
        }
        async function validateForm(){
           const {valid}=await form.value.validate()
           if(valid){
                logUserIn(username.value,password.value)
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
            navigateToRoute
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
    <v-card class="mr-1 bg-yellow-accent-1 my-2" elevation="5">
        <v-img
        width="130"
        height="380"
        cover
        src="./src/assets/road2.jpg"
        ></v-img>
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
                :rules="[v=>!!v||$t('alerts.usernameRequired')]"
                required
            ></v-text-field>

            <v-text-field
                clearable
                :type="type"
                v-model="password"
                :label="$t('forms.password')"
                :rules="[v=>!!v||$t('alerts.passwordRequired')]"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="passwordVisible?'mdi-eye-outline':'mdi-eye-off-outline'"
                placeholder="Enter your password"
                variant="outlined"
                @click:append-inner="toggleMarker"
            ></v-text-field>

            <br>

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
                <span class="mr-2 font-weight-bold">Pas encore de compte ?</span>
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
    
    
    </v-sheet>
</template>