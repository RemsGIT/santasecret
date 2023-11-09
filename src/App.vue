<template>
    <santa-secret />
    
    <foots-walking/>
</template>

<script>
import SantaSecret from "@/components/SantaSecret";
import FootsL from "@/components/foots/Foots.vue";

export default {
    name: "App",
    components: {
        'foots-walking': FootsL,
        "santa-secret": SantaSecret
    },
};
</script>

<style lang="scss">
html,body{
    height:100%;
    margin: 0;
    background-color: red;
}
#app {
    background: url("https://img00.deviantart.net/5088/i/2013/171/5/5/the_back_of_the_marauders_map_by_littlefallingstar-d69tz1k.jpg");
    height: 100%;
    cursor: url(http://imageshack.com/a/img922/6285/gC18h6.png),auto;
    overflow: hidden;
}

</style>
