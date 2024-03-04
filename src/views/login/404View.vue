<script lang="ts">
    import { useRouter } from 'vue-router';

export default{
    setup(){
        const router=useRouter();


        return{
            router
        }
    }
}

</script>

<template>
    <v-sheet
        class=" bg-transparent"
    >
        <v-card
            rounded
            class="pa-5"
        >
            <v-card-title class="d-flex flex-column justify-center align-center">
                <v-icon icon="mdi-wifi"/>
                <span>Erreur lors du chargement de votre page</span>
            </v-card-title>
            <v-card-item>
                <v-list>
                    <v-list-item
                        class="d-flex justify-start align-center"
                    >
                        <v-icon icon="mdi-circle" color="blue"/>
                        <span class="text-body-1 text-center">Votre connexion internet est intérrompue</span>
                    </v-list-item>
                    <v-list-item
                        class="d-flex justify-start align-center"
                    >
                        <v-icon icon="mdi-circle" color="red"/>
                        <span class="text-body-1 text-center">La page demandée n'existe pas</span>
                    </v-list-item>
                    <v-list-item
                        class="d-flex justify-start align-baseline"
                    >
                        <v-icon icon="mdi-circle" color="green"/>
                        <span class="text-body-1"> Une erreur inattendue s'est produite </span>
                    </v-list-item>
                </v-list>
            </v-card-item>
            <v-card-actions class="d-flex justify-center">
                <v-btn
                    variant="flat"
                    color="red-accent-3"
                    prepend-icon="mdi-refresh"
                    @click="router.go(0)"
                >
                    feedback
                </v-btn>
                <v-btn
                    variant="flat"
                    color="deep-purple"
                    prepend-icon="mdi-home"
                    @click="router.go(0)"
                >
                    Accueil
                </v-btn>
            </v-card-actions>

        </v-card>

    </v-sheet>
</template>