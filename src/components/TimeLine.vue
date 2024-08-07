<script lang="ts">
  import { useTranslation } from 'i18next-vue';
import { useRouter } from 'vue-router';

  export default{
    setup(){
      const router=useRouter();
      const {i18next,t}=useTranslation();

      function goToOrder(){
        router.push("order")
      }
      function goToDashboard(){
        router.push("dashboard")
      }
      function goToReports(){
        router.push("reports")
      }
      return{
        goToOrder,
        goToDashboard,
        goToReports
      }
    }

  }
</script>


<template>
    <div class="d-flex justify-center align-center w-100">
          <div class="d-flex flex-column overdrop mt-2 ml-12 px-5">
            <v-timeline >
              <v-timeline-item
                dot-color="white"
                fill-dot
                icon="mdi-numeric-1-circle"
                icon-color="blue-darken-1"
              >
                <v-card>
                  <v-card-title class="bg-green d-fle">
                    <v-icon icon="mdi-seed-plus"/>
                    <span class="text-body-1 ml-1">{{$t("timeline.commandTitle")}}</span>
                  </v-card-title>
                  <v-card-text>
                    {{$t("timeline.commandMessage")}}
                  </v-card-text>
                  <v-card-actions class="">
                    <v-btn
                      variant="elevated"
                      color="blue"
                      prepend-icon="mdi-tag-plus"
                      @click="goToOrder"
                    >
                      {{$t("timeline.commandAction")}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
              <v-timeline-item
                dot-color="white"
                fill-dot
                icon="mdi-numeric-2-circle"
                icon-color="green"
              >
                <v-card>
                  <v-card-title class="bg-blue d-fle">
                    <v-icon icon="mdi-truck-fast"/>
                    <span class="text-body-1 ml-1">{{$t("timeline.dashboardTitle")}}</span>
                  </v-card-title>
                  <v-card-text>
                      {{$t("timeline.dashboardMessage")}}
                  </v-card-text>
                  <v-card-actions class="">
                    <v-btn
                      variant="elevated"
                      color="green"
                      prepend-icon="mdi-view-dashboard"
                      @click="goToDashboard"
                    >
                    {{$t("timeline.dashboardAction")}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
              <v-timeline-item
                dot-color="white"
                fill-dot
                icon="mdi-numeric-3-circle"
                icon-color="blue-darken-3"
              >
                <v-card>
                  <v-card-title class="bg-purple-lighten-2 d-fle">
                    <v-icon icon="mdi-chart-arc"/>
                    <span class="text-body-1 ml-1"> {{$t("timeline.reportTitle")}}</span>
                  </v-card-title>
                  <v-card-text>
                    {{$t("timeline.reportMessage")}}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      variant="elevated"
                      color="yellow"
                      prepend-icon="mdi-chart-scatter-plot"
                      @click="goToReports"
                    >
                    {{$t("timeline.reportAction")}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
        </div>
</template>