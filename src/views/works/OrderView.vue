<script lang="ts">
    import { ref } from 'vue'
    import {useTranslation} from "i18next-vue";
    import {fetchDraftedCommand,manageDraftedCommand,loadMTLs} from "../../services/commandServices";
    import { computed } from 'vue';

    import { onMounted } from 'vue';
    import { useUserSTore } from '@/stores/user';
    import { usePagesStore } from '@/stores/pages';
    import { useRoute } from 'vue-router';
export default{

    setup(){
        const step=ref(1)
        const {i18next,t}=useTranslation()
        const materialComboItems=([])

        const loadingDraft=ref(true)
        const loadingMTLs=ref(true)
        const activity=ref(false)
        const draftedCommand=ref(false)

        const location=useRoute()

        const draft:any=ref({})
        const mtls:any=ref([])

        const userStore=useUserSTore()

        const username=computed(()=>userStore.getUsername)

        async function manageDrafted(commandId:string){
            activity.value=true
            const response=await manageDraftedCommand(commandId);
            if(response.status==200){
                draft.value={}
                draftedCommand.value=false
            }else{
                draft.value={}
                draftedCommand.value=false
            }
            activity.value=false
        }

        function ceationComplete(){
            alert("super zuper fuper")
        }

        onMounted(async()=>{
            //Page redirection when refreshing setup
            localStorage.removeItem("lastVisitedPage")
            localStorage.setItem("lastVisitedPage",location.path)
            
            const drafted=await fetchDraftedCommand(username.value)
            draft.value=drafted
            loadingDraft.value=false
            draftedCommand.value=Object.keys(drafted).length===0?false:true

            const mtlsLoaded=await fetchDraftedCommand(username.value)
            mtls.value=mtlsLoaded
            loadingMTLs.value=false

        })
        
        return{
            step,
            draftedCommand,
            draft,
            manageDrafted,
            activity,
            loadingDraft,
            ceationComplete

        }
    }

}

</script>

<template>
    <v-sheet
        width="100%"
        max-width="1000"

    >
    <form-wizard @onComplete="ceationComplete" step-size="xs">
        <tab-content :title="$t('UI.commandStepperFirst')">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-skeleton-loader
                    v-if="loadingDraft"
                    type="card-avatar, actions"
                    >
                    </v-skeleton-loader>
                    <v-col v-if="draftedCommand&&!loadingDraft">
                        <v-card 
                            variant="elevated"
                            hover
                        >   
                            
                            <div class="d-flex flex-md-row flex-column justify-space-between  align-center pa-5">
                                <div>
                                    <v-card-title class="d-flex justify-start align-center">
                                        <v-icon icon="mdi-alarm-bell" color="purple"/>
                                        Notification
                                    </v-card-title>
                                    <v-card-text class="text-body-1 ml-5">
                                        Vous avez une commande enregistré en brouillon.
                                        <br/>
                                        Vous avez donc la possibilité de charger celle-ci ou de l'écraser.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            @click=""
                                            :disabled="activity"
                                            color="green"
                                            text="Charger"
                                            prepend-icon="mdi-cloud-upload"
                                        >

                                        </v-btn>
                                        <v-btn
                                            @click="manageDrafted(draft.command.id)"
                                            :loading="activity"
                                            color="red"
                                            text="Ecraser"
                                            prepend-icon="mdi-delete"
                                        >

                                        </v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="mr-2">
                                    <div>
                                        <v-card
                                            variant="tonal"
                                            color="green"
                                            elevation="3"
                                        >
                                            <v-card-title class="d-flex align-center flex-wrap">
                                                <v-icon icon="mdi-alpha-b-circle" color="green"/>
                                                <span class="ml-1">Commande en brouillon</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.command.reference }}</v-list-item-title>
                                                        <v-list-item-subtitle>Reference</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ new Date(draft.command.createdDate).toLocaleDateString('fr-FR',{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}}</v-list-item-title>
                                                        <v-list-item-subtitle>Date de création</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.lines.length===0?"Aucun":draft.lines.length}}</v-list-item-title>
                                                        <v-list-item-subtitle>Nombres de lignes</v-list-item-subtitle>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col v-else class="mb-1">
                        <v-card>
                            <v-card-title class="d-flex align-center">
                                <v-icon icon="mdi-lightning-bolt-circle" color="deep-purple"/>
                                <span class="ml-3">Bon à savoir</span>
                            </v-card-title>
                            <v-card-item>
                                <v-list density="compact">
                                    <v-list-item>
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-cloud-circle" color="blue"/>
                                                    <span class="text-h6">Possibilité d'enregistrer en Brouillon</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Vous avez la possibilité à tout moment d'enregistrer votre commande en brouillon.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-leaf-circle" color="green"/>
                                                    <span class="text-h6">Suivi des commandes</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Les commandes évoluent suivant 8 statuts différents.
                                                    décrivant une étape du traitement.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-crown-circle" color="orange"/>
                                                    <span class="text-h6">Passer une commande</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Cliquer sur suivant et vous pourrez choisir le matériau pour la commande.
                                                    <br/>
                                                    La fenêtre des essais permet de choisir les essais pour une ligne de matériau donnée.
                                                    <br/>
                                                    La fenêtre de validation permet de finaliser la commande
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-card-item>
                        
                        </v-card>
                    </v-col>     
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperSecond')">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-skeleton-loader
                    v-if="loadingDraft"
                    type="card-avatar, actions"
                    >
                    </v-skeleton-loader>
                    <v-col v-if="draftedCommand">
                        <v-card 
                            variant="elevated"
                            hover
                        >
                            <div class="d-flex flex-md-row flex-column justify-space-between  align-center pa-5">
                                <div>
                                    <v-card-title class="d-flex justify-start align-center">
                                        <v-icon icon="mdi-alarm-bell" color="purple"/>
                                        Notification
                                    </v-card-title>
                                    <v-card-text class="text-body-1 ml-5">
                                        Vous avez une commande enregistré en brouillon.
                                        <br/>
                                        Vous avez donc la possibilité de charger celle-ci ou de l'écraser.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            @click=""
                                            :disabled="activity"
                                            color="green"
                                            text="Charger"
                                            prepend-icon="mdi-cloud-upload"
                                        >

                                        </v-btn>
                                        <v-btn
                                            @click="manageDrafted(draft.command.id)"
                                            :loading="activity"
                                            color="red"
                                            text="Ecraser"
                                            prepend-icon="mdi-delete"
                                        >

                                        </v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="mr-2">
                                    <div>
                                        <v-card
                                            variant="tonal"
                                            color="green"
                                            elevation="3"
                                        >
                                            <v-card-title class="d-flex align-center flex-wrap">
                                                <v-icon icon="mdi-alpha-b-circle" color="green"/>
                                                <span class="ml-1">Commande en brouillon</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.command.reference }}</v-list-item-title>
                                                        <v-list-item-subtitle>Reference</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ new Date(draft.command.createdDate).toLocaleDateString('fr-FR',{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}}</v-list-item-title>
                                                        <v-list-item-subtitle>Date de création</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.lines.length===0?"Aucun":draft.lines.length}}</v-list-item-title>
                                                        <v-list-item-subtitle>Nombres de lignes</v-list-item-subtitle>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col v-else class="mb-1">
                        <v-card>
                            <v-card-item>
                                <v-list density="compact">
                                    <v-list-item>
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-cloud-circle" color="blue"/>
                                                    <span class="text-h6">Possibilité d'enregistrer en Brouillon</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Vous avez la possibilité à tout moment d'enregistrer votre commande en brouillon.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-leaf-circle" color="green"/>
                                                    <span class="text-h6">Suivi des commandes</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Les commandes évoluent suivant 8 statuts différents.
                                                    décrivant une étape du traitement.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-crown-circle" color="orange"/>
                                                    <span class="text-h6">Passer une commande</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Cliquer sur suivant et vous pourrez choisir le matériau pour la commande.
                                                    <br/>
                                                    La fenêtre des essais permet de choisir les essais pour une ligne de matériau donnée.
                                                    <br/>
                                                    La fenêtre de validation permet de finaliser la commande
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-card-item>
                        
                        </v-card>
                    </v-col>     
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperThird')">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-skeleton-loader
                    v-if="loadingDraft"
                    type="card-avatar, actions"
                    >
                    </v-skeleton-loader>
                    <v-col v-if="draftedCommand">
                        <v-card 
                            v-if="draftedCommand"
                            variant="elevated"
                            hover
                        >
                            <div class="d-flex flex-md-row flex-column justify-space-between  align-center pa-5">
                                <div>
                                    <v-card-title class="d-flex justify-start align-center">
                                        <v-icon icon="mdi-alarm-bell" color="purple"/>
                                        Notification
                                    </v-card-title>
                                    <v-card-text class="text-body-1 ml-5">
                                        Vous avez une commande enregistré en brouillon.
                                        <br/>
                                        Vous avez donc la possibilité de charger celle-ci ou de l'écraser.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            @click=""
                                            :disabled="activity"
                                            color="green"
                                            text="Charger"
                                            prepend-icon="mdi-cloud-upload"
                                        >

                                        </v-btn>
                                        <v-btn
                                            @click="manageDrafted(draft.command.id)"
                                            :loading="activity"
                                            color="red"
                                            text="Ecraser"
                                            prepend-icon="mdi-delete"
                                        >

                                        </v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="mr-2">
                                    <div>
                                        <v-card
                                            variant="tonal"
                                            color="green"
                                            elevation="3"
                                        >
                                            <v-card-title class="d-flex align-center flex-wrap">
                                                <v-icon icon="mdi-alpha-b-circle" color="green"/>
                                                <span class="ml-1">Commande en brouillon</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.command.reference }}</v-list-item-title>
                                                        <v-list-item-subtitle>Reference</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ new Date(draft.command.createdDate).toLocaleDateString('fr-FR',{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}}</v-list-item-title>
                                                        <v-list-item-subtitle>Date de création</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.lines.length===0?"Aucun":draft.lines.length}}</v-list-item-title>
                                                        <v-list-item-subtitle>Nombres de lignes</v-list-item-subtitle>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col v-else class="mb-1">
                        <v-card>
                            <v-card-item>
                                <v-list density="compact">
                                    <v-list-item>
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-cloud-circle" color="blue"/>
                                                    <span class="text-h6">Possibilité d'enregistrer en Brouillon</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Vous avez la possibilité à tout moment d'enregistrer votre commande en brouillon.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-leaf-circle" color="green"/>
                                                    <span class="text-h6">Suivi des commandes</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Les commandes évoluent suivant 8 statuts différents.
                                                    décrivant une étape du traitement.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-crown-circle" color="orange"/>
                                                    <span class="text-h6">Passer une commande</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Cliquer sur suivant et vous pourrez choisir le matériau pour la commande.
                                                    <br/>
                                                    La fenêtre des essais permet de choisir les essais pour une ligne de matériau donnée.
                                                    <br/>
                                                    La fenêtre de validation permet de finaliser la commande
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-card-item>
                        
                        </v-card>
                    </v-col>     
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperFourth')">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-skeleton-loader
                    v-if="loadingDraft"
                    type="card-avatar, actions"
                    >
                    </v-skeleton-loader>
                    <v-col v-if="draftedCommand">
                        <v-card 
                            v-if="draftedCommand"
                            variant="elevated"
                            hover
                        >
                            <div class="d-flex flex-md-row flex-column justify-space-between  align-center pa-5">
                                <div>
                                    <v-card-title class="d-flex justify-start align-center">
                                        <v-icon icon="mdi-alarm-bell" color="purple"/>
                                        Notification
                                    </v-card-title>
                                    <v-card-text class="text-body-1 ml-5">
                                        Vous avez une commande enregistré en brouillon.
                                        <br/>
                                        Vous avez donc la possibilité de charger celle-ci ou de l'écraser.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            @click=""
                                            :disabled="activity"
                                            color="green"
                                            text="Charger"
                                            prepend-icon="mdi-cloud-upload"
                                        >

                                        </v-btn>
                                        <v-btn
                                            @click="manageDrafted(draft.command.id)"
                                            :loading="activity"
                                            color="red"
                                            text="Ecraser"
                                            prepend-icon="mdi-delete"
                                        >

                                        </v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="mr-2">
                                    <div>
                                        <v-card
                                            variant="tonal"
                                            color="green"
                                            elevation="3"
                                        >
                                            <v-card-title class="d-flex align-center flex-wrap">
                                                <v-icon icon="mdi-alpha-b-circle" color="green"/>
                                                <span class="ml-1">Commande en brouillon</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.command.reference }}</v-list-item-title>
                                                        <v-list-item-subtitle>Reference</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ new Date(draft.command.createdDate).toLocaleDateString('fr-FR',{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}}</v-list-item-title>
                                                        <v-list-item-subtitle>Date de création</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.lines.length===0?"Aucun":draft.lines.length}}</v-list-item-title>
                                                        <v-list-item-subtitle>Nombres de lignes</v-list-item-subtitle>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col v-else class="mb-1">
                        <v-card>
                            <v-card-item>
                                <v-list density="compact">
                                    <v-list-item>
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-cloud-circle" color="blue"/>
                                                    <span class="text-h6">Possibilité d'enregistrer en Brouillon</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Vous avez la possibilité à tout moment d'enregistrer votre commande en brouillon.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-leaf-circle" color="green"/>
                                                    <span class="text-h6">Suivi des commandes</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Les commandes évoluent suivant 8 statuts différents.
                                                    décrivant une étape du traitement.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-crown-circle" color="orange"/>
                                                    <span class="text-h6">Passer une commande</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Cliquer sur suivant et vous pourrez choisir le matériau pour la commande.
                                                    <br/>
                                                    La fenêtre des essais permet de choisir les essais pour une ligne de matériau donnée.
                                                    <br/>
                                                    La fenêtre de validation permet de finaliser la commande
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-card-item>
                        
                        </v-card>
                    </v-col>     
            </v-sheet>
        </tab-content>
    </form-wizard>


       <!--  <v-stepper 
            v-model="step" 
            :items="items"
            show-actions
            :next-text="$t('navigation.next')"
            :prev-text="$t('navigation.previous')"
        >
            <template v-slot:item.1>
                <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-skeleton-loader
                    v-if="loadingDraft"
                    type="card-avatar, actions"
                    >
                    </v-skeleton-loader>
                    <v-col v-if="draftedCommand">
                        <v-card 
                            v-if="draftedCommand"
                            variant="elevated"
                            hover
                        >
                            <div class="d-flex flex-md-row flex-column justify-space-between  align-center pa-5">
                                <div>
                                    <v-card-title class="d-flex justify-start align-center">
                                        <v-icon icon="mdi-alarm-bell" color="purple"/>
                                        Notification
                                    </v-card-title>
                                    <v-card-text class="text-body-1 ml-5">
                                        Vous avez une commande enregistré en brouillon.
                                        <br/>
                                        Vous avez donc la possibilité de charger celle-ci ou de l'écraser.
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn
                                            @click=""
                                            :disabled="activity"
                                            color="green"
                                            text="Charger"
                                            prepend-icon="mdi-cloud-upload"
                                        >

                                        </v-btn>
                                        <v-btn
                                            @click="manageDrafted(draft.command.id)"
                                            :loading="activity"
                                            color="red"
                                            text="Ecraser"
                                            prepend-icon="mdi-delete"
                                        >

                                        </v-btn>
                                    </v-card-actions>
                                </div>
                                <div class="mr-2">
                                    <div>
                                        <v-card
                                            variant="tonal"
                                            color="green"
                                            elevation="3"
                                        >
                                            <v-card-title class="d-flex align-center flex-wrap">
                                                <v-icon icon="mdi-alpha-b-circle" color="green"/>
                                                <span class="ml-1">Commande en brouillon</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.command.reference }}</v-list-item-title>
                                                        <v-list-item-subtitle>Reference</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ new Date(draft.command.createdDate).toLocaleDateString('fr-FR',{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}}</v-list-item-title>
                                                        <v-list-item-subtitle>Date de création</v-list-item-subtitle>
                                                    </v-list-item>
                                                    <v-list-item>
                                                        <v-list-item-title>{{ draft.lines.length===0?"Aucun":draft.lines.length}}</v-list-item-title>
                                                        <v-list-item-subtitle>Nombres de lignes</v-list-item-subtitle>
                                                    </v-list-item>
                                                </v-list>
                                            </v-card-text>
                                        </v-card>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                    <v-col v-else class="mb-1">
                        <v-card>
                            <v-card-item>
                                <v-list density="compact">
                                    <v-list-item>
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-cloud-circle" color="blue"/>
                                                    <span class="text-h6">Possibilité d'enregistrer en Brouillon</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Vous avez la possibilité à tout moment d'enregistrer votre commande en brouillon.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-leaf-circle" color="green"/>
                                                    <span class="text-h6">Suivi des commandes</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Les commandes évoluent suivant 8 statuts différents.
                                                    décrivant une étape du traitement.
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                    <v-list-item
                                        rounded="shaped"
                                        color="primary"
                                    >
                                        <div class="d-flex justify-space-between align-center">
                                            <div>
                                                <v-list-item-title class="d-flex align-center">
                                                    <v-icon icon="mdi-crown-circle" color="orange"/>
                                                    <span class="text-h6">Passer une commande</span>
                                                </v-list-item-title>
                                                <v-list-item-subtitle class="d-flex flex-wrap ml-7 pb-3">
                                                    Cliquer sur suivant et vous pourrez choisir le matériau pour la commande.
                                                    <br/>
                                                    La fenêtre des essais permet de choisir les essais pour une ligne de matériau donnée.
                                                    <br/>
                                                    La fenêtre de validation permet de finaliser la commande
                                                </v-list-item-subtitle>
                                                
                                            </div>
                                            <div>
                                                <v-list-item-action>
                                                    <v-btn
                                                        variant="outlined"
                                                        color="deep-purple"
                                                    >
                                                        Documentation
                                                    </v-btn>
                                                </v-list-item-action>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-card-item>
                        
                        </v-card>
                    </v-col>     
                </v-sheet>
            </template>
            <template v-slot:item.2>
                <v-sheet 
                >
                    <p class="text-h2">Page des matériaux</p>
                </v-sheet>
            </template>
            <template v-slot:item.3>
                <v-sheet 
                    height="100%"
                    width="100%"
                    color="blue"
                >
                <p class="text-h2">Page des matériaux</p>
                </v-sheet>
            </template>
            <template v-slot:item.4>
                <v-sheet 
                    height="100%"
                    width="100%"
                    color="blue"
                >
                    <p class="text-h2">Page des matériaux</p>
                </v-sheet>
            </template>
            
        </v-stepper> -->

    </v-sheet>
</template>