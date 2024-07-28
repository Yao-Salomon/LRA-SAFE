<script lang="ts">
    import { onMounted,ref,computed } from 'vue';
    import { useUserSTore } from '@/stores/user';
    import {useKeyStore} from '@/stores/userDetails';

    export default{
        created () {
        },
        setup(){
            const pageLoading=ref(false)
            const submittingForm=ref(false)
            const userStore=useUserSTore();
            const credentialsStore=useKeyStore();

            const username=computed(()=>userStore.getUsername)
            const credentials=computed(()=>credentialsStore.getUserInfos)
            const firstName=computed(()=>credentials.value.firstName)
            const lastName=computed(()=>credentials.value.lastName)
            const email=computed(()=>credentials.value.email)
            const number=computed(()=>credentials.value.number)

            onMounted(()=>{
                pageLoading.value=true;
                pageLoading.value=false;
            })
            return{
                pageLoading,
                username,
                submittingForm,
                firstName,
                lastName,
                email,
                number,
                credentials
            }
        }
    }
</script>

<template>
    <v-sheet v-if="pageLoading" width="80%" height="80%">
            <v-skeleton-loader
            class="mx-auto border"
            width="80%"
            type="card-avatar, actions,article"
            ></v-skeleton-loader>
    </v-sheet>
    <v-sheet class="w-33" v-else>
        <v-text-field v-model="username" label="Nom d'utilisateur"></v-text-field>
        <v-text-field v-model="firstName" label="Nom"></v-text-field>
        <v-text-field label="Prénoms" v-model="lastName" ></v-text-field>
        <v-text-field label="Numéro de téléphone" v-model="number" ></v-text-field>
        <v-text-field label="Email" v-model="email" ></v-text-field>
        <v-btn rounded="sm" variant="flat" color="green" :loading="submittingForm" class="mt-2" text="Soumettre" type="submit"></v-btn>
    </v-sheet>
</template>