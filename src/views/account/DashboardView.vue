<script lang="ts">
    import { BarChart,PolarAreaChart,RadarChart,BubbleChart,ScatterChart} from 'vue-chart-3';
    import { Chart, registerables } from "chart.js";
    import  { computed, defineComponent, onMounted, ref } from 'vue';
    import { fetchCommands } from '@/services/commandServices';
    import { useUserSTore } from '@/stores/user';
    import { getFileByRef } from '@/services/reportingServices';
import { useAuthStore } from '@/stores/auth';


    Chart.register(...registerables);
    export default defineComponent({
        name:'DashboardComponent',
        components:{BarChart},
        setup(){
            const userStore=useUserSTore();
            const authStore=useAuthStore();
            const username=computed(()=>userStore.getUsername);
            const auth=computed(()=>authStore.getCredential)
            const pageLoading=ref(true)
            const commands:any=ref([])
            const reference:any=ref('')

            const commandsFiltered:any=computed(()=>{
                let filter=commands.value.filter((e:any)=>{
                     return e.reference.includes(reference.value)
                })
                if(filter.length==0){
                    return commands.value
                }else{
                    return filter
                }
            })
            const chartData=ref([])
            

            const testData =computed(()=>({
                labels: ['Commandes', 'Initiées', 'Planifiées', 'Traitées', 'Validées','Livrées','Confirmées','Bloquées'],
                datasets: [
                    {
                    label:"Commandes",
                    data: chartData.value,
                    backgroundColor: ['#004FF9', '#FFF94C', '#ff0084', '#ff0084', '#fcb045','#A5C8ED','#A5C8ED','#A5C8ED'],
                    },
                ],
            }))
            
            async function showOrderReceipt(fileRef:any){
                
                pageLoading.value=true
                const fileResponse=await getFileByRef(encodeURIComponent(fileRef),auth.value);
                var blob = new Blob([fileResponse], {
                type: 'application/pdf',
                });
                const link = document.createElement('a');
                // create a blobURI pointing to our Blob
                var URL = window.URL || window.webkitURL;
                
                link.href = URL.createObjectURL(blob);
                link.download = "Bon de commande";
                // some browser needs the anchor to be in the doc
                document.body.append(link);
                link.click();
                pageLoading.value=false;
                link.remove();
            }
            onMounted(async ()=>{
                const commandResponse=await fetchCommands(username.value,auth.value)
                commandResponse.sort((a:any,b:any)=>{
                    let dateA=new Date(a.createdDate);
                    let dateB=new Date(b.createdDate);

                    if (dateA.getTime()<dateB.getTime())
                        return 1;
                    if (dateA.getTime()>dateB.getTime())
                        return -1;
                    
                    return 0;
                });
                let createdCommands=commandResponse.filter((el:any)=>{
                    return el.status=="CREATED" || el.status=="INITIATED" || el.status=="PLANNED" || el.status=="PLANNING_APPROVED" || el.status=="TREATED" || el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                })
                let initiatedCommands=commandResponse.filter((el:any)=>{
                    return el.status=="INITIATED" || el.status=="PLANNED" || el.status=="PLANNING_APPROVED" || el.status=="TREATED" || el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                })
                let plannedCommands=commandResponse.filter((el:any)=>{
                    return el.status=="PLANNED" ||el.status=="PLANNING_APPROVED" || el.status=="TREATED" || el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                })
                /**
                    let planning_approved =new Array(commandResponse).filter((el:any)=>{
                        return el.status=="PLANNING_APPROVED" ||el.status=="TREATED" || el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                    })
                */
                let treatedCommands =new Array(commandResponse).filter((el:any)=>{
                    return el.status=="TREATED" || el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                })
                /**
                    let validatedCommands =new Array(commandResponse).filter((el:any)=>{
                        return el.status=="VALIDATED" || el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                    })
                */
                let deliveredCommands =new Array(commandResponse).filter((el:any)=>{
                    return el.status=="DELIVERED" || el.status=="CONFIRMED" || el.status=="BLOCKED";
                })
                let confirmedCommands =new Array(commandResponse).filter((el:any)=>{
                    return el.status=="CONFIRMED";
                })
                let blockedCommands =new Array(commandResponse).filter((el:any)=>{
                    return el.status=="BLOCKED";
                })

                let transferArray:any=[];
                transferArray.push(createdCommands.length,initiatedCommands.length,plannedCommands.length,treatedCommands.length,deliveredCommands.length,confirmedCommands.length,blockedCommands.length)
                chartData.value=transferArray
                commands.value=commandResponse
                pageLoading.value=false
            })
            return{
                testData,
                commands,
                showOrderReceipt,
                pageLoading,
                reference,
                commandsFiltered,
                PolarAreaChart,
                RadarChart,
                BubbleChart,
                ScatterChart
            }
        }
    
    })
</script>

<template>
    <v-row>
        <v-col cols="7">
            <div v-if="!pageLoading">
                <div class="mt-2 ml-2" style="width: 95%">
                    <v-text-field
                        type="search"
                        placeholder="Filtrer les commandes par référence"
                        prepend-inner-icon="mdi-magnify"
                        v-model="reference"
                    />
                </div>
                <div v-if="commands.length>0" class="border ml-1 rounded-lg bg-grey-lighten-5 pa-2" style="overflow-y: scroll;width: 95%;height: 450px;">
                    <v-sheet :class="{shake:true}" class="bg-blue pa-2 rounded-lg mb-2" elevation="2">
                        <p class="text-body-1 ">Mes commandes</p>
                    </v-sheet>
                    <div class="d-flex flex-wrap justify-start">
                        <v-card :key="index" v-for="(command,index) in commandsFiltered" class="ma-1" width="200px" height="150px" variant="tonal" color="green-darken-1">
                                <v-card-item>
                                    <p class="">
                                        <v-icon icon="mdi-invoice-list"/>
                                        <span>{{command.reference}}</span>
                                    </p>
                                </v-card-item>
                                <v-card-text>
                                    <p><span class="font-weight-bold">Date:</span> {{ new Date(command.createdDate).toLocaleDateString("fr-FR") }}</p>
                                    <p><span class="font-weight-bold">Status:</span> <span style="font-weight: bold; font-size:10px;">{{command.status}}</span></p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn
                                        v-if="index%2==1"
                                        color="green"
                                        variant="tonal"
                                        @click="showOrderReceipt(command.file.file)"
                                    >
                                        Bon de commande
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        color="blue"
                                        variant="tonal"
                                        @click="showOrderReceipt(command.file.file)"
                                    >
                                        Bon de commande
                                    </v-btn>
                                </v-card-actions>
                        </v-card>
                    </div>
                </div>
                <v-sheet v-else :class="{shake:true}" class="d-flex justify-center align-center bg-blue pa-2 rounded-lg mt-1" elevation="2">
                    <p>Aucune commande n'a encore été passée</p>
                </v-sheet>
            </div>
            <v-skeleton-loader
                v-else
                class="mx-auto border"
                width="80%"
                type="card-avatar, actions,article"
            ></v-skeleton-loader>
        </v-col>
        <v-col>
            <v-sheet :class="{shake:true}" class="bg-blue pa-2 rounded-lg mt-3" elevation="2">
                <p>Récap des commandes</p>
            </v-sheet>
            <BarChart title="Récap des commandes" :chartData="testData"/>
            <!--
            <LineChart :chartData="testData"/>
            <DoughnutChart :chartData="testData" />
            <PolarAreaChart :chartData="testData"/>
            <RadarChart :chartData="testData"/>
            <BubbleChart :chartData="testData"/>
            <ScatterChart :chartData="testData"/>
            -->
        </v-col>
    </v-row>
</template>

<style>
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-button:start:decrement,
    ::-webkit-scrollbar-button:end:increment  {
        height: 30px;
        display: block;
        background-color: transparent;
    }

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