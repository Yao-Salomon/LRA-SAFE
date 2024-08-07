<script lang="ts">
    import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useUserSTore } from "@/stores/user";
import {computed, onMounted, ref} from "vue";

    export default{
        setup(){
            const pageLoading=ref(false);
            const submittingForm=ref(false);
            const userStore=useUserSTore();
            const authStore=useAuthStore();
            const username=computed(()=>userStore.getUsername)
            const auth=computed(()=>authStore.getCredential)
            
            onMounted(()=>{
                console.log("************ %s *********** with language: %s", "Logout")

                if(username.value&&auth.value){
                    //
                }else{
                    router.push("/login")
                }
            })

            return{
                pageLoading,
                submittingForm
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
    <v-sheet class="w-75" v-else>
        <v-row>
            <v-col>
                <v-text-field label="Nom"></v-text-field>
                <v-text-field label="Prénoms"></v-text-field>
                <v-text-field label="Numéro de téléphone"></v-text-field>
                <v-text-field label="Email"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field label="Entreprise"></v-text-field>
                <v-text-field label="Siège sociale"></v-text-field>
                <v-textarea label="Détails"></v-textarea>
            </v-col>
        </v-row>
        <v-btn rounded="sm" variant="flat" color="green" :loading="submittingForm" class="mt-2" text="Soumettre" type="submit"></v-btn>
    </v-sheet>
</template>