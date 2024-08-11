<script lang="ts">
    import { onMounted,ref,computed } from 'vue';
    import { useUserSTore } from '@/stores/user';
    import {useKeyStore} from '@/stores/userDetails';
    import { useTranslation } from 'i18next-vue';
    import { updateUser } from '@/services/loginServices';
import { useAuthStore } from '@/stores/auth';

    export default{
        created () {
        },
        setup(){
            const pageLoading=ref(false)
            const submittingForm=ref(false)
            const userStore=useUserSTore();
            const credentialsStore=useKeyStore();
            const {i18next,t}=useTranslation();
            const authStore=useAuthStore();
            const snackbar=ref(false);
            const snackbarText=ref("");

            const rules={
                number:(v:any) => /^\d{10}$/.test(v)||"Le numéro de téléphone doit être formé de 10 chiffres",
            }

            const auth=computed(()=>authStore.getCredential);
            const username=ref(" ");
            const credentials=computed(()=>credentialsStore.getUserInfos)
            const firstName=ref("");
            const lastName=ref("");
            const email=ref("");
            const number=ref("");

            onMounted(()=>{
                pageLoading.value=true;
                username.value=userStore.getUsername;
                firstName.value=credentials.value.firstName==undefined?"":credentials.value.firstName;
                lastName.value=credentials.value.lastName==undefined?"":credentials.value.lastName;
                email.value=credentials.value.email==undefined?"":credentials.value.email;
                number.value=credentials.value.number==undefined?"":credentials.value.number;

                pageLoading.value=false;
            })
            async function submitForm(){
                submittingForm.value=true;
                console.log("The parameters",username.value,firstName.value,lastName.value,number.value,email.value)
                const updating=await updateUser(username.value,firstName.value,lastName.value,number.value,email.value,auth.value);
                console.log("The updating",updating)
                if(updating.status==200){
                    snackbar.value=true;
                    snackbarText.value=t('message.userCreated');
                }else{
                    snackbar.value=true;
                    snackbarText.value=t('message.creationError');
                }
                submittingForm.value=false;
            }
            return{
                pageLoading,
                username,
                submittingForm,
                firstName,
                lastName,
                email,
                number,
                credentials,
                submitForm,
                snackbar,
                snackbarText,
                rules
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
        {{ $t('forms.closeCaption') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-sheet v-if="pageLoading" width="80%" height="80%">
            <v-skeleton-loader
            class="mx-auto border"
            width="80%"
            type="card-avatar, actions,article"
            ></v-skeleton-loader>
    </v-sheet>
    <v-sheet class="w-33" v-else>
        <v-text-field v-model="username" label="Nom d'utilisateur" readonly></v-text-field>
        <v-text-field v-model="firstName" label="Nom"></v-text-field>
        <v-text-field label="Prénoms" v-model="lastName" ></v-text-field>
        <v-text-field label="Numéro de téléphone" :rules="[rules.number]" v-model="number" ></v-text-field>
        <v-text-field label="Email" v-model="email" ></v-text-field>
        <v-btn @click="submitForm" rounded="sm" variant="flat" color="green" :loading="submittingForm" class="mt-2" :text="$t('forms.submit')" type="submit"></v-btn>
    </v-sheet>
</template>