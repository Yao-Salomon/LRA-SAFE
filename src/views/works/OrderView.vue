<script lang="ts">
    import { ref } from 'vue'
    import {useTranslation} from "i18next-vue";
    import {fetchDraftedCommand,manageDraftedCommand,loadMTLs, fetchConstructionSites, loadSituations, createCommand} from "@/services/commandServices";
    import {checkValidCode, filterArrayUnique, getAbbrById, getConstructionSiteById, getExternalIDByAbbr, getExternalIDById, getMaterialAbbrById, getMaterialByCode, getMaterialIDByCode, getTrialsByCode,getTrialByID,getMaterialObjectByCode, getWaysById} from "@/utils"
    import { computed } from 'vue';

    import { onMounted } from 'vue';
    import { useUserSTore } from '@/stores/user';
    import { usePagesStore } from '@/stores/pages';
    import { useLink, useRoute,useRouter } from 'vue-router';
    import { getReportId, getTDRReportId, runReport, runTDRReport } from '@/services/reportingServices';
    import router from '@/router';

export default{

    setup(){
        const step=ref(1)
        const {i18next,t}=useTranslation()
        let mtlsMappedMaterial:any=[]
        const pageLoading=ref(true)
        const reportLoading=ref(false)
        const router=useRouter()
        const uniquesMappedMaterial:any=ref([])
        const constructionSites:any=ref([])
        const selectedConstructionSite=ref('')
        
        const activity=ref(false)
        const draftedCommand=ref(false)
        const snackbar=ref(false)
        const snackbarText=ref('')
        const situations:any=ref([])
        const selectedMaterialCodes:any=ref([])

        let orderedMaterialList:any=[]
        let orderedMaterialWithTrials:any=[]

        const currentBoxFieldValue=ref("");
        const currentDatePrelevement=ref("");
        const currentOrigine=ref("");
        const currentSituation=ref("");
        const openedMaterialPanel=ref();
        const currentDetails=ref("");

        const runReportLoading=ref(false)

        //Data for final command building
        const materialToMapTrial=ref("");
        const selectedTrials=ref([])
        
        const finalMaterialWithTrials:any=ref([])

        const location=useRoute()

        const draft:any=ref({})
        const mtls:any=ref([])

        const userStore=useUserSTore()

        const username=computed(()=>userStore.getUsername)
        const addBtnActive=computed(()=>currentBoxFieldValue.value&&currentSituation.value.length>0&&currentDatePrelevement.value.length>0&&currentOrigine.value.length>0&&currentDetails.value.length>0)
        const addBtnToFinalActive=computed(()=>materialToMapTrial.value&&selectedTrials.value.length>0)
        const listOfTrials=computed(()=>fetchTrialsRM(materialToMapTrial.value))
        const constructionSiteExternalId=computed(()=>getConstructionSiteById(constructionSites.value,selectedConstructionSite.value))
        const selectedConstructionSiteWays=computed(()=>getWaysById(constructionSites.value,selectedConstructionSite.value))

        const openedMaterialPanelExternalID=computed(()=>{
            
            if(openedMaterialPanel.value==undefined){
                return '';
            }else{
                return getMaterialByCode(selectedMaterialCodes.value,openedMaterialPanel.value)
            }
        })
        const openedMaterialPanelID=computed(()=>{
            if(openedMaterialPanel.value==undefined){
                return '';
            }else{
                return getMaterialIDByCode(selectedMaterialCodes.value,openedMaterialPanel.value)
            }
        })
        const trialsForOpenedMaterialPanel=computed(()=>{
            
            if(openedMaterialPanel.value==undefined){
                return [];
            }else{
                console.log("The getTrialsBy code return function",getTrialsByCode(finalMaterialWithTrials.value,openedMaterialPanel.value))
                if(getTrialsByCode(finalMaterialWithTrials.value,openedMaterialPanel.value)!=undefined){
                    return getTrialsByCode(finalMaterialWithTrials.value,openedMaterialPanel.value)
                }else{
                    return 0
                } 
            }
        })

        const trialsForMaterialByCode=computed(()=>{
            let trials=mtls.value.filter((e:any)=>{
                return e.material.id==openedMaterialPanelID.value
            }).map((e:any)=>{
                return e.trial
            })
            return filterArrayUnique(trials).sort((a:any,b:any)=> {
                
                if (a.externalID>b.externalID)
                    return 1;
                if (a.externalID<b.externalID)
                    return -1;
                
                return 0;
            });
        })

        function fetchTrialsRM(materialID:any){
           
            if(materialID.length>0){
                let trials=mtls.value.filter((e:any)=>{
                    return e.material.id==materialID
                }).map((e:any)=>{
                    return e.trial
                })
                return filterArrayUnique(trials).sort((a:any,b:any)=> {
                    
                    if (a.externalID>b.externalID)
                        return 1;
                    if (a.externalID<b.externalID)
                        return -1;
                    
                    return 0;
                });

            }else{
                let trials=mtls.value.map((e:any)=>{
                    return e.trial
                })
                return filterArrayUnique(trials).sort((a:any,b:any)=> {
                    
                    if (a.externalID>b.externalID)
                        return 1;
                    if (a.externalID<b.externalID)
                        return -1;
                    
                    return 0;
                })
            }
        }

        function deleteMaterial(materialCode:any){
            
            let result=orderedMaterialList.filter((e:any)=>{
                return e.materialCode!=materialCode
            })
            
            orderedMaterialList=[...result];
            selectedMaterialCodes.value=orderedMaterialList;
            
            
        }
        function getTrialByIDUI(container:any,id:any){
            return getTrialByID(container,id)
        }
        
        function manageMaterialLines(){
            
            let lineObject:any={};
            lineObject["materialId"]=currentBoxFieldValue.value;
            lineObject["samplingDate"]=currentDatePrelevement.value;
            lineObject["origin"]=currentOrigine.value;
            lineObject["situation"]=currentSituation.value;
            lineObject["details"]=currentDetails.value
            
            let materialCode=getMaterialAbbrById(uniquesMappedMaterial.value,currentBoxFieldValue.value,currentDatePrelevement.value,currentOrigine.value,currentSituation.value);
            let materialExternalID=getExternalIDById(uniquesMappedMaterial.value,currentBoxFieldValue.value)
            let situationExternalID=getExternalIDByAbbr(situations.value,currentSituation.value);
            let materialAbbreviation=getAbbrById(uniquesMappedMaterial.value,currentBoxFieldValue.value)

            if(materialCode!=0){

                lineObject["materialCode"]=materialCode;
                lineObject["materialExternalID"]=materialExternalID;
                lineObject["situationExternalID"]=situationExternalID;
                lineObject["materialAbbreviation"]=materialAbbreviation;

                const codeValid=checkValidCode(orderedMaterialList,materialCode);
                if(codeValid){
                    orderedMaterialList.push(lineObject); 
                    selectedMaterialCodes.value=[...orderedMaterialList];
                    currentBoxFieldValue.value="";
                    currentDatePrelevement.value="";
                    currentOrigine.value="";
                    currentSituation.value="";
                    currentDetails.value="";
                }else{
                   snackbar.value=true
                   snackbarText.value="Cette ligne existe déjà"
                }

            }else{
                //SnackBar
            }
            
        }
        function validateConstructionSites(){

            if(selectedConstructionSite.value.length==0){
                if(constructionSites.value.length==0){
                    snackbarText.value="Vous n'avez aucun chantier d'habilitation"//A traduire
                }else{
                    snackbarText.value="Vous devez choisir un chantier"//A traduire
                }
                snackbar.value=true
                return false
            }else{
                return true
            }

        }

        function validateMaterials(){
            if(selectedMaterialCodes.value.length==0){
                snackbar.value=true
                snackbarText.value="Vous devez ajouter au moins un matériau à la liste"
                return false
            }else{
                return true;
            }
        }

        function validateFinalList(){
            if(finalMaterialWithTrials.value.length>0){
                let valid=true
                finalMaterialWithTrials.value.forEach((element:any,index:any) => {
                    if(element.trials.length==0){
                        valid&&=false
                    }else{
                        valid&&=true
                    }
                });
                if(valid){
                    return true
                }else{
                    snackbar.value=true
                    snackbarText.value="Vous devez vous assurer de renseigner au moins un essai par matériau choisi"
                    return false
                }
                
            }else{
                snackbar.value=true
                snackbarText.value="Vous devez vous assurer de renseigner au moins un essai par matériau choisi"
                return false
            }
        }

        function buildFinalCommandList(){
            let lineObject:any={}
            let material=getMaterialObjectByCode(selectedMaterialCodes.value,openedMaterialPanel.value)
            console.log("The material logged",material);
            lineObject['materialId']=material.materialId
            lineObject['samplingDate']=material.samplingDate
            lineObject["origin"]=material.origin;
            lineObject["situation"]=material.situation;
            lineObject["details"]=material.details
            lineObject['materialCode']=openedMaterialPanel.value;
            lineObject['trials']=selectedTrials.value

            const codeValid=checkValidCode(finalMaterialWithTrials.value,openedMaterialPanel.value);

            if(codeValid){
                orderedMaterialWithTrials.push(lineObject); 
                finalMaterialWithTrials.value=[...orderedMaterialWithTrials];
            }else{
                finalMaterialWithTrials.value.forEach((e:any,index:any,a:any)=>{
                    if(e.materialCode==openedMaterialPanel.value){
                        a.splice(index,1,lineObject)
                    }
                })
            }
            console.log("The finalMaterialWit trials list",finalMaterialWithTrials.value);
        }
        async function creationComplete(){
            pageLoading.value=true
            const commandCreation=await createCommand(username.value,selectedConstructionSite.value,finalMaterialWithTrials.value);
            pageLoading.value=false
            console.log(commandCreation)
            
            if(commandCreation.status==200){
                console.log("The status for creation entered")
                router.push("/dashboard")
            }else{
                snackbar.value=true
                snackbarText.value=commandCreation.message
            }
            
        }

        async function launchTDRReport(){
            reportLoading.value=true
            const response = await getTDRReportId(username.value);
            const fileResponse=await runTDRReport(response,[{'name':'site' ,'value':selectedConstructionSite.value}]);
          
            var blob = new Blob([fileResponse], {
            type: 'application/pdf',
            });
            const link = document.createElement('a');
            // create a blobURI pointing to our Blob
            var URL = window.URL || window.webkitURL;
            
            link.href = URL.createObjectURL(blob);
            link.download = "TDR"+selectedConstructionSite.value;
            // some browser needs the anchor to be in the doc
            document.body.append(link);
            link.click();

            reportLoading.value=false
            link.remove();

            
        }


        onMounted(async()=>{

            pageLoading.value=true

            const drafted=await fetchDraftedCommand(username.value)
            const mtlsLoaded=await loadMTLs()
            const situationsLoaded=await loadSituations()
            constructionSites.value=await fetchConstructionSites(username.value);
            situations.value=situationsLoaded
        
            
            mtls.value=mtlsLoaded
            mtlsMappedMaterial=mtlsLoaded.map((e:any,index:any)=>{
                return {
                    index:index,
                    id:e.material.id,
                    externalID:e.material.externalID,
                    materialSection:e.material.section,
                    materialAbbreviation:e.material.abbreviation,
                }
            })
            uniquesMappedMaterial.value=filterArrayUnique(mtlsMappedMaterial);
            pageLoading.value=false

        })
        
        return{
            step,
            draftedCommand,
            draft,
            activity,
            creationComplete,
            uniquesMappedMaterial,
            mtls,
            currentBoxFieldValue,
            currentDatePrelevement,
            currentSituation,
            currentOrigine,
            manageMaterialLines,
            addBtnActive,
            constructionSites,
            selectedConstructionSite,
            validateConstructionSites,
            snackbar,
            snackbarText,
            situations,
            selectedMaterialCodes,
            validateMaterials,
            materialToMapTrial,
            selectedTrials,
            listOfTrials,
            deleteMaterial,
            addBtnToFinalActive,
            runReportLoading,
            launchTDRReport,
            constructionSiteExternalId,
            selectedConstructionSiteWays,
            openedMaterialPanel,
            openedMaterialPanelExternalID,
            trialsForOpenedMaterialPanel,
            trialsForMaterialByCode,
            buildFinalCommandList,
            getMaterialByCode,
            getTrialByIDUI,
            finalMaterialWithTrials,
            validateFinalList,
            pageLoading,
            reportLoading,
            currentDetails

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
    <v-sheet v-else width="100%" max-width="1000">

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
    <form-wizard  @onComplete="creationComplete" class="border rounded-lg" errorColor="red" transition="fade" color="green" step-size="xs" next-button-text="Suivant"> 
        <tab-content :title="$t('UI.commandStepperFirst')" :beforeChange="validateConstructionSites">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-row v-if="constructionSites.length>0">
                        <v-col>
                            <div class=" text-center ">
                                <v-sheet :class="{shake:true}" class="bg-blue pa-2 rounded-lg" elevation="2">
                                    <p class="text-h6 font-weight-bold">
                                        Choisissez un chantier
                                    </p>
                                </v-sheet>
                                <v-icon class="text-h3" icon="mdi-sign-caution" color="orange"/>
                            </div>
                            
                            <v-radio-group inline v-model="selectedConstructionSite" class="d-flex justify-center align-center" elevation="3" style="min-height:235px;overflow-y: scroll;">
                                <div v-for="item in constructionSites" class="d-flex  ma-1 bg-green pa-1 rounded-xl">
                                    <v-card class="bg-green h-100 border py-3 rounded-s-xl d-flex justify-center align-center" rounded="0" >
                                        <v-radio :value="item.id"></v-radio>
                                    </v-card>
                                    <v-card class="border rounded-e-xl pl-3 py-3 pr-2 d-flex align-center" rounded="0" max-width="250px">
                                        <p class="text-body-1">{{ item.externalID }}</p>
                                    </v-card>
                                </div>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row v-else>
                        <v-col cols="12">
                            <div class="w-100 h-100 d-flex justify-content-center align-items-center">
                                <p>
                                    <v-icon icon="mdi-leaf-circle" color="blue"/>
                                    Vous ne disposez d'aucune habilitation valide vous permettant de passer une commande
                                </p>
                            </div>
                        </v-col>
                    </v-row> 
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperSecond')" :beforeChange="validateMaterials">
            <v-sheet 
                    height="100%"
                    width="100%"
                >   
                    <v-row>
                        <v-col>
                            <v-select
                                prepend-inner-icon="mdi-leaf-circle"
                                :items="uniquesMappedMaterial"
                                item-value="id"
                                item-title="externalID"
                                label="Matériaux"
                                v-model="currentBoxFieldValue"
                            >
                            </v-select>
                            <v-text-field
                                label="Date de  prélèvement"
                                type="date"
                                v-model="currentDatePrelevement"
                            >
                            </v-text-field>
                            <v-btn
                                prepend-icon="mdi-book-open"
                                color="orange"
                                :loading="reportLoading"
                                variant="tonal"
                                class="align-self-end align-items-ends"
                                @click="launchTDRReport"
                            >
                                Voir le TDR
                            </v-btn>
                            <div class="mt-3">
                                <p class="text-body-1">
                                    <span class="font-weight-bold">Chantier: </span>
                                    {{ constructionSiteExternalId }}
                                </p>
                            </div>
                        </v-col>
                        <v-col
                            
                        >
                            <v-select
                                label="Origine"
                                prepend-inner-icon="mdi-palette-swatch"
                                :items="selectedConstructionSiteWays"
                                item-value="abbreviation"
                                hide-no-data
                                item-title="externalID"
                                v-model="currentOrigine"
                            >
                            </v-select>
                            <v-select
                                label="Situation"
                                prepend-inner-icon="mdi-palette-swatch"
                                :items="situations"
                                item-value="abbreviation"
                                hide-no-data
                                item-title="externalID"
                                v-model="currentSituation"
                            >
                            </v-select>
                            <v-text-field
                                label="Détails"
                                prepend-inner-icon="mdi-details"
                                v-model="currentDetails"
                            >
                            </v-text-field>
                           
                            <v-btn
                                icon="mdi-folder-plus"
                                :disabled="!addBtnActive"
                                color="green"
                                class="align-self-end align-items-ends"
                                @click="manageMaterialLines"
                            >
                            </v-btn>
                            
                        </v-col>
                        <v-col cols="5">
                            <v-card style="height: 300px; overflow-y: scroll;">
                                <v-card-title class="d-flex align-center">
                                    <v-icon icon="mdi-book-open-page-variant" color="blue"/>
                                    <span class="text-body-1 ml-1">Liste des matériaux sélectionnés</span>
                                </v-card-title>
                                <v-card-item v-if="selectedMaterialCodes.length>0">
                                    <v-expansion-panels>
                                        <v-expansion-panel 
                                            elevation="1"
                                            class="my-1"
                                            v-for="(item,index) in selectedMaterialCodes"
                                        >
                                            <v-expansion-panel-title>
                                               <div class="d-flex justify-space-between align-center" style="width:250px">
                                                    <p class="font-weight-bold"> <v-icon icon="mdi-image-filter-vintage" color="green"/>{{ item.materialAbbreviation.toUpperCase() }}</p>
                                                    <v-btn
                                                        icon="mdi-delete"
                                                        class="ml-3"
                                                        color="red"
                                                        size="sm"
                                                        @click="deleteMaterial(item.materialCode)"
                                                    >
                                                    </v-btn>
                                               </div>
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <p class="d-flex align-center">
                                                    <span class="font-weight-bold mr-2"> 
                                                        Nom:  
                                                    </span>
                                                    <span>
                                                        {{ item.materialExternalID }}
                                                    </span>
                                                </p>
                                                <p class="d-flex align-center">
                                                    <span class="font-weight-bold mr-2"> 
                                                        Situation:  
                                                    </span>
                                                    <span>
                                                        {{ item.situation.toUpperCase() }} ({{ item.situationExternalID }})
                                                    </span>
                                                </p>
                                                <p class="d-flex align-center">
                                                    <span class="font-weight-bold mr-2"> 
                                                        Date:  
                                                    </span>
                                                    <span>
                                                        {{ new Date(item.samplingDate).toLocaleDateString() }}
                                                    </span>
                                                </p>
                                                <p class="d-flex align-center">
                                                    <span class="font-weight-bold mr-2"> 
                                                        Origine:  
                                                    </span>
                                                    <span>
                                                        {{ item.origin }}
                                                    </span>
                                                </p>
                                                <p class="d-flex align-center">
                                                    <span class="font-weight-bold mr-2"> 
                                                        Détails:  
                                                    </span>
                                                    <span>
                                                        {{ item.details }}
                                                    </span>
                                                </p>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                    
                                </v-card-item>
                                <v-card-item v-else>
                                    <p>
                                        <v-icon icon="mdi-leaf-circle"/>
                                        <span>Ajouter des matériaux à la liste de commande</span>
                                    </p>
                                </v-card-item>
                            </v-card>
                        </v-col>
                        
                    </v-row> 
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperThird')" :beforeChange="validateFinalList">
            <v-sheet height="300px" class="border pa-1 d-flex">
                <div style="max-width: 30%;max-height: 100%;overflow-y: scroll;">
                    <v-expansion-panels
                        v-model="openedMaterialPanel"
                    >
                        <v-expansion-panel 
                            elevation="1"
                            class="my-1"
                            v-for="(item,index) in selectedMaterialCodes"
                            :value="item.materialCode"
                        >
                            <v-expansion-panel-title>
                                <div class="d-flex justify-space-between align-center" style="width:250px">
                                    <p class="font-weight-bold"> <v-icon icon="mdi-image-filter-vintage" color="green"/>{{ item.materialAbbreviation.toUpperCase() }}</p>
                                </div>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <p class="d-flex align-center">
                                    <span class="font-weight-bold mr-2"> 
                                        Nom:  
                                    </span>
                                    <span>
                                        {{ item.materialExternalID }}
                                    </span>
                                </p>
                                <p class="d-flex align-center">
                                    <span class="font-weight-bold mr-2"> 
                                        Situation:  
                                    </span>
                                    <span>
                                        {{ item.situation.toUpperCase() }} ({{ item.situationExternalID }})
                                    </span>
                                </p>
                                <p class="d-flex align-center">
                                    <span class="font-weight-bold mr-2"> 
                                        Date:  
                                    </span>
                                    <span>
                                        {{ new Date(item.samplingDate).toLocaleDateString() }}
                                    </span>
                                </p>
                                <p class="d-flex align-center">
                                    <span class="font-weight-bold mr-2"> 
                                        Origine:  
                                    </span>
                                    <span>
                                        {{ item.origin }}
                                    </span>
                                </p>
                                <p class="d-flex align-center">
                                    <span class="font-weight-bold mr-2"> 
                                        Détails:  
                                    </span>
                                    <span>
                                        {{ item.details }}
                                    </span>
                                </p>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>
                <div class="d-flex justify-center bg-grey-lighten-4 ml-2 border rounded-sm" style="width:69%;min-height: 100%;overflow-y: scroll;" >
                    <div class="d-flex text-center flex-column w-100 h-100">
                        <div class="bg-green">
                            <p class="font-weight-bold text-body-1 pt-2">
                                <v-icon icon="mdi-star-cog"/>
                                {{ openedMaterialPanelExternalID!=''?openedMaterialPanelExternalID:'Sélectionner un matériau' }}
                            </p>
                            <div>
                                <v-dialog
                                    width="auto"
                                    scrollable
                                    :close-on-back="false"
                                    :close-on-content-click="false"
                                >
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn
                                            icon="mdi-store-plus-outline"
                                            v-bind="activatorProps"
                                        ></v-btn>
                                    </template>
                                    <template v-slot:default="{ isActive }">
                                        <v-card
                                            prepend-icon="mdi-store-plus-outline"
                                            title="Choisissez un ou plusieurs essais"
                                        >
                                            <v-divider class="mt-3"></v-divider>
                                            <v-card-text>
                                                <v-checkbox 
                                                    v-for="(trial,index) in trialsForMaterialByCode"
                                                    :color="index%2==1?'blue':'green'"
                                                    v-model="selectedTrials"
                                                    :value="trial.id"
                                                    :label="trial.externalID"
                                                />
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-btn
                                                    text="Close"
                                                    variant="flat"
                                                    color="grey"
                                                    @click="()=>{
                                                        isActive.value = false
                                                        selectedTrials=[]
                                                    }"
                                                ></v-btn>

                                                <v-spacer></v-spacer>

                                                <v-btn
                                                    color="blue"
                                                    text="OK"
                                                    variant="flat"
                                                    @click="()=>{
                                                        buildFinalCommandList()
                                                        selectedTrials=[]
                                                        isActive.value=false
                                                    }"
                                                ></v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </template>
                                </v-dialog>
                            </div>
                        </div>
                        
                        <div style="overflow-y: scroll;" class="h-100 border d-flex justify-center align-center flex-wrap" v-if="trialsForOpenedMaterialPanel!=0">
                            <div class="h-100 d-flex justify-center align-center w-100" v-if="trialsForOpenedMaterialPanel.trials.length==0">
                                <v-chip variant="tonal" color="deep-purple" elevation="1">
                                    <v-icon icon="mdi-chart-bubble" class="text-h4"/>
                                    <span class="text-body-1">La liste des essais est vide.</span>
                                </v-chip>
                            </div>
                           <div class="ma-1" v-for="(item,index) in trialsForOpenedMaterialPanel.trials" v-else>
                                <v-card v-if="index%2==1" variant="tonal" color="green" width="200px" height="120px">
                                    <v-card-item>
                                        <p>
                                            {{ getTrialByIDUI(trialsForMaterialByCode,item).abbreviation }}
                                        </p>
                                    </v-card-item>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <p>
                                            <span class="font-weight-bold">Traitement : </span>{{ getTrialByIDUI(trialsForMaterialByCode,item).preTreatmentDelay+getTrialByIDUI(trialsForMaterialByCode,item).treatmentDelay+getTrialByIDUI(trialsForMaterialByCode,item).postTreatmentDelay }}
                                            <span>Jours</span>
                                        </p>
                                    </v-card-text>
                                </v-card>
                                <v-card v-else variant="tonal" color="blue" width="200px" height="120px">
                                    <v-card-item>
                                        <p>
                                            {{ getTrialByIDUI(trialsForMaterialByCode,item).abbreviation }}
                                        </p>
                                    </v-card-item>
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <p>
                                            <span class="font-weight-bold">Traitement : </span>{{ getTrialByIDUI(trialsForMaterialByCode,item).preTreatmentDelay+getTrialByIDUI(trialsForMaterialByCode,item).treatmentDelay+getTrialByIDUI(trialsForMaterialByCode,item).postTreatmentDelay }}
                                            <span>Jours</span>
                                        </p>
                                    </v-card-text>
                                </v-card>
                           </div>
                        </div>
                        <div class="h-100 d-flex justify-center align-center d-flex flex-column" v-else>
                            <p v-if="openedMaterialPanelExternalID!=''">Aucun essai n'a été selectionné pour ce matériau</p>
                            <p v-else>Choisissez un matériau!</p>
                            <p>Cliquer sur l'icône <v-icon icon="mdi-store-plus-outline"/> pour ajouter des essais</p>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </v-sheet>
        </tab-content>
        <tab-content :title="$t('UI.commandStepperFourth')">
            <v-sheet height="300px" class="border pa-1 d-flex flex-column">   
                <div class="d-flex justify-center w-100 mb-2">
                    <v-chip class="text-body-1" prepend-icon="mdi-cart" variant="tonal" color="blue">Finalisation de la commande</v-chip>
                </div>
                <div class="d-flex flex-row" style="overflow-y: scroll">
                    <div class=" ma-2 " v-for="item in finalMaterialWithTrials">
                        <v-card height="120px">
                            <v-card-item class="font-weight-bold d-flex justify-content-center align-items-center">
                                <v-alert variant="outlined" color="green">
                                    <v-icon icon="mdi-domain" size="large" color="green-darken-2"></v-icon>
                                    {{ item.materialCode }}
                                </v-alert>
                            </v-card-item>
                            <v-card-item>
                                <p><span>Quantité: </span>{{ item.trials.length }}</p>
                            </v-card-item>
                        </v-card>
                    </div>

                </div>
            </v-sheet>
        </tab-content>
    </form-wizard>
    </v-sheet>
</template>
<style>

.shake {
        animation: shake 10s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        transform: translate3d(0, 0, 0);
        animation-iteration-count: infinite;
        
    }

    @keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
    }

</style>