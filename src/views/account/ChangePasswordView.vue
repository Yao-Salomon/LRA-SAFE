<script lang="ts">
    import { computed, onMounted,ref } from 'vue';
    import { encodePassword } from '@/utils';
    import { changePassword } from '@/services/loginServices';
    import { useUserSTore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

    export default{
        created () {
        },
        setup(){
            const pageLoading=ref(false);
            const submittingForm=ref(false);
            const userStore=useUserSTore();
            const authStore=useAuthStore();
            const password=ref("")
            const pConfirm=ref("")
            const types=["password","text"]
            const icons=["mdi-eye","mdi-eye-off"]
            const ctypes=["password","text"]
            const cicons=["mdi-eye","mdi-eye-off"]
            const type=ref(types[0])
            const icon=ref(icons[0])
            const ctype=ref(ctypes[0])
            const cicon=ref(cicons[0])
            const snackbar=ref(true);
            const snackbarText=ref("");
            const rules={
                equality:()=>password.value==pConfirm.value||"Les mots de passe ne concordent pas",
                length:(value:string)=>value.length>=8||"Le mot de passe doit au moins (8) caractères",
                required:(value:string)=>!!value || "Le mot de passe ne peut être vide",
            }
            const username=computed(()=>userStore.getUsername)
            const auth=computed(()=>authStore.getCredential)


            onMounted(()=>{
                console.log("The current icon are: ",icon.value);
                console.log("The current type is: ",type.value)
            })

            function toggleType(){
                type.value=types.filter(e=>e!=types[types.findIndex(e=>e==type.value)])[0];
                icon.value=icons.filter(e=>e!=icons[icons.findIndex(e=>e==icon.value)])[0];
            }

            function cToggleType(){
                ctype.value=ctypes.filter(e=>e!=ctypes[ctypes.findIndex(e=>e==ctype.value)])[0];
                cicon.value=cicons.filter(e=>e!=cicons[cicons.findIndex(e=>e==cicon.value)])[0];
            }
            async function submitForm(){
                const encodedP=encodePassword(password.value);
                submittingForm.value=true;                
                const response=await changePassword(username.value,encodedP,auth.value);
                if(response){
                    console.log("The response")
                }
                submittingForm.value=false;
            }
            return{
                pageLoading,
                submittingForm,
                password,
                pConfirm,
                type,
                icon,
                toggleType,
                cToggleType,
                ctype,
                cicon,
                rules,
                submitForm,
                snackbar,
                snackbarText
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
            {{ $t('forms.close') }}
            </v-btn>
        </template>
        </v-snackbar>
        <v-text-field :type="type" v-model="password" :rules="[rules.length,rules.required]" label="Mot de passe">
            <template v-slot:append-inner>
                <v-icon
                    @click="toggleType()"
                    :icon="icon"
                />
            </template>
        </v-text-field>
        <v-text-field :type="ctype" v-model="pConfirm" :rules="[rules.length,rules.required,rules.equality]"  label="Confirmation du mot de passe">
            <template v-slot:append-inner>
                <v-icon
è                    @click="cToggleType()"
                    :icon="cicon"
                />
            </template>
        </v-text-field>
        <v-btn rounded="sm" variant="flat" color="green" :loading="submittingForm" class="mt-2" text="Soumettre" type="submit" @click="submitForm()"></v-btn>
    </v-sheet>
</template>