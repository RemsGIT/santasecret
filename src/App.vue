<template>
    
    <h1 class="find_name_title">Trouve ton nom</h1>
    
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
html,
body {
    height: 100%;
    width: 100%;
    margin: 0;
    background-color: black;
    overflow: hidden;
}

#app {
    background: url("https://img00.deviantart.net/5088/i/2013/171/5/5/the_back_of_the_marauders_map_by_littlefallingstar-d69tz1k.jpg");
    height: 100%;
    width: 100%;
    cursor: url("../public/img/app/cursor_hp.png"), pointer;
    /* overflow: hidden; */ /* Retirer cette ligne pour permettre le bon fonctionnement du curseur sur toute la page */
    position: relative;
}

.find_name_title {
    font-size: 70px;
    position: absolute;
    font-family: 'Harry Potter', sans-serif;
    letter-spacing: 5px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
}
</style>
