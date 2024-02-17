<script>

    export default{
        setup(){
            const cards=[
                {
                    "name":"New commands",
                    "link":"link",
                    "icon":"icon",
                    "satus":false,
                    "statusContent":"Content"
                },
                {
                    "name":"Commands monitoring",
                    "name":"link",
                    "icon":"icon",
                    "satus":false,
                    "statusContent":"2"
                }
            ]
            return{
                cards
            }
        }
    }

</script>
<template>
    <v-sheet class="d-flex">
        <v-card v-for="card in cards" class="">
            
        </v-card>
    </v-sheet>
</template>