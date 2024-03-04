<script setup lang="ts">

</script>


<template>
    <div class="d-flex w-100 ">
          <div class="d-flex overdrop mt-2 ml-12 px-5">
            <v-timeline direction="vertical">
              <v-timeline-item
                dot-color="white"
                fill-dot
                icon="mdi-numeric-1-circle"
                icon-color="blue-darken-1"
              >
                <v-card>
                  <v-card-title class="bg-green d-fle">
                    <v-icon icon="mdi-seed-plus"/>
                    <span class="text-body-1 ml-1">Passer une commande</span>
                  </v-card-title>
                  <v-card-text>
                    Votre processus commence par l'action de passer une nouvelle commande
                  </v-card-text>
                  <v-card-actions class="">
                    <v-btn
                      variant="elevated"
                      color="blue"
                      prepend-icon="mdi-tag-plus"
                    >
                      Commencer
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
                    <span class="text-body-1 ml-1">Suivre la commande à chaque étape</span>
                  </v-card-title>
                  <v-card-text>
                      Votre commande est suivie à chaque étape
                      de son traitement.
                  </v-card-text>
                  <v-card-actions class="">
                    <v-btn
                      variant="elevated"
                      color="green"
                      prepend-icon="mdi-view-dashboard"
                    >
                      Tableau de bord
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
                    <span class="text-body-1 ml-1"> Consulter vos rapports</span>
                  </v-card-title>
                  <v-card-text>
                    Des états de commande sont générés au fil du traitement de
                    votre commande.
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      variant="elevated"
                      color="yellow"
                      prepend-icon="mdi-chart-scatter-plot"
                    >
                      Rapports & Etats
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
        </div>
</template>