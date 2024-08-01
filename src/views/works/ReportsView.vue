<script lang="ts">
    import { ref, type Ref } from 'vue';
    import { onMounted } from 'vue';
    import {fetchCls,fetchIndicators} from "@/services/statusService";
    import { computed } from 'vue';
    import { useUserSTore } from '@/stores/user';
    import { fetchCommands } from '@/services/commandServices';
    import { DoughnutChart} from 'vue-chart-3';
    import { Chart, registerables } from "chart.js";
    import {downloadFile} from "@/utils/download";
import { useAuthStore } from '@/stores/auth';
    
    //Component list: LineChart,BarChart,PolarAreaChart,RadarChart,BubbleChart,ScatterChart
    Chart.register(...registerables);
    export default{
        name:'ReportComponent',
        components:{DoughnutChart},
        setup(){
            //reactive properties
            const chosenReport=ref("");
            const chosenCommand=ref("");
            const pageLoading=ref(true);
            const cls:Ref<[{status:string,pV:{file:{title:string,createdDate:string,file:string}}}]>=ref([{status:"",pV:{file:{title:"",createdDate:" ",file:""}}}]);
            const indicators:any=ref([]);

            const clsSize=computed(()=>cls.value.length);
            const clsCSize=computed(()=>cls.value.filter((cl)=>cl.status=="CREATED").length)
            const clsPSize=computed(()=>cls.value.filter((cl)=>cl.status=="PLANNED").length)
            const clsRSize=computed(()=>cls.value.filter((cl)=>cl.status=="REALISED").length)
            const clsTSize=computed(()=>cls.value.filter((cl)=>cl.status=="TREATED").length)
            const clsASize=computed(()=>cls.value.filter((cl)=>cl.status=="APPROVED").length)

            const clsAList=computed(()=>cls.value.filter((cl)=>cl.status=="APPROVED"&&cl.pV!=null))

            const commands:any=ref([]);
            const userStore=useUserSTore();
            const authStore=useAuthStore();
            const username=computed(()=>userStore.getUsername)
            const auth=computed(()=>authStore.getCredential)

            const chartData:any=ref([])
            const clChartData =computed(()=>({
                labels: ['Crées', 'Planifiées', 'Réalisés', 'Traitées','Approuvés'],
                datasets: [
                    {
                    label:"Lignes de commandes",
                    data: chartData.value,
                    backgroundColor: ['#ff0084','#f7995e','#f7d35e', '#eaf75e', '#5ef77a'],
                    },
                ],
            }))

            const reportsList=[
                {name:"pro",content:"Avancement"},
                {name:"pv",content:"PV"},
                {name:"ind",content:"Indicateurs"},
                {name:"rel",content:"Réalisation"}
            ]

            onMounted(async ()=>{
                console.log("************ %s ***********", "Reports View mounted")
                pageLoading.value=true;
                cls.value=await fetchCls(username.value,auth.value);
                commands.value=await fetchCommands(username.value,auth.value);
                indicators.value=await fetchIndicators(username.value,auth.value);
                chartData.value=[clsCSize.value,clsPSize.value,clsRSize.value,clsTSize.value,clsASize.value]
                pageLoading.value=false;
            })

            function downloadPv(fileResponse:any,title:string){
                downloadFile(fileResponse,title)
            }

            return{
                reportsList,
                chosenReport,
                chosenCommand,
                commands,
                pageLoading,
                clsSize,
                clsCSize,
                clsPSize,
                clsRSize,
                clsTSize,
                clsASize,
                clChartData,
                clsAList,
                downloadPv,
                indicators
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
        <v-sheet v-else width="100%" height="100%">
            <v-row class="mt-3 mx-2 w-75">
                <v-col>
                    <v-select
                    prepend-inner-icon="mdi-leaf-circle"
                    :items="reportsList"
                    item-value="name"
                    item-title="content"
                    label="Types"
                    v-model="chosenReport"
                    >
                    </v-select>
                </v-col>
                <v-col>
                    <v-select
                    prepend-inner-icon="mdi-leaf-circle"
                    :items="commands"
                    item-value="id"
                    item-title="reference"
                    label="Commande"
                    v-model="chosenCommand"
                    >
                    </v-select>
                </v-col>
                <v-col>
                    <v-text-field
                        label="De"
                        type="date"
                    >
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        label="A"
                        type="date"
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row class="mx-2">
                <v-col cols="2">
                    <v-card variant="outlined" color="blue-darken-1">
                        <v-card-item>
                            Créés : {{ clsCSize }}
                        </v-card-item>
                        <v-card-item>
                            Planifiés : {{ clsPSize }}
                        </v-card-item>
                        <v-card-item>
                            Réalisés : {{ clsRSize }}
                        </v-card-item>
                        <v-card-item>
                            Traités :  {{ clsTSize }}
                        </v-card-item>
                        <v-card-item>
                            Approuvés : {{ clsASize }}
                        </v-card-item>
                        <v-card-item>
                            <v-chip variant="elevated" color="green-lighten-1">Total: {{ clsSize }}</v-chip>
                        </v-card-item>
                    </v-card>
                </v-col>
                <v-col v-if="chosenReport==reportsList[0].name" class="">
                    <div class="h-75">
                        <DoughnutChart title="Statut" :chartData="clChartData"/>
                    </div>
                </v-col>
                <v-col v-else-if="chosenReport==reportsList[1].name">
                    <div class="d-flex flex-wrap">
                        <v-card class="ma-1" width="250" variant="tonal" :key="index" color="blue" v-for="clA,index in clsAList">
                            <v-card-text>
                                <p>{{ clA.pV.file.title }}</p>
                                <p>Date:{{ new Date(clA.pV.file.createdDate).toLocaleDateString("fr",{year:"numeric",month:"long",day:"numeric"}) }}</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn variant="outlined" color="green" @click="downloadPv(clA.pV.file.file,clA.pV.file.title)">
                                    <v-icon icon="mdi-certificate"></v-icon>
                                    Voir
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </div>
                </v-col>
                <v-col v-else-if="chosenReport==reportsList[2].name">
                    <v-table theme="light">
                        <thead>
                            <tr>
                                <th class="text-left">
                                    #
                                </th>
                                <th class="text-left">
                                    Titre
                                </th>
                                <th class="text-left">
                                    Valeur
                                </th>
                                <th class="text-left">
                                    Description
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item,index in indicators"
                                :key="item.name"
                            >
                                <td>{{ index+1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.value }}</td>
                                <td>{{ item.description }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-col>
                <v-col v-else>
                    
                </v-col>
            </v-row>
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