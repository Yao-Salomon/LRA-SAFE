<script lang="ts">
    import { onMounted,ref } from 'vue';
    export default{
        created () {
        },
        setup(){
            const pageLoading=ref(false);
            const submittingForm=ref(false);
            const password=ref("")
            const pConfirm=ref("")
            const types=["password","text"]
            const type=ref(types[0])

            onMounted(()=>{

            })

            function toogleType(){

            }
            return{
                pageLoading,
                submittingForm,
                password,
                pConfirm
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
        <v-text-field type="password" v-model="password" label="Mot de passe">
            
        </v-text-field>
        <v-text-field type="password" v-model="pConfirm" label="Confirmation du mot de passe"></v-text-field>
        <v-btn rounded="sm" variant="flat" color="green" :loading="submittingForm" class="mt-2" text="Soumettre" type="submit"></v-btn>
    </v-sheet>
</template>