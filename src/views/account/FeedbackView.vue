<script lang="ts">

    import { onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    export default{
        setup(){
            const location =useRoute()
        

            console.log("the router called from the feedback",location.path)
            onMounted(()=>{
                
            })
            return(
                location
            )
        }

    }
</script>

<template>
    <p>Feedback</p>
</template>