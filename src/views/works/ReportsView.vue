<script lang="ts">

    export default{
        setup(){

            return{

            }
        }
    }
</script>

<template>
    <v-sheet :class="{shake:true}" class="bg-blue pa-2 rounded-lg" elevation="2">
        <p>Aucun rapport n'a encore été généré</p>
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