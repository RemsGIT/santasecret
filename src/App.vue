<template>
    <santa-secret />
</template>

<script>
import SantaSecret from "@/components/SantaSecret";

export default {
    name: "App",
    components: {
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    padding: 0;

    background-image: url("../public/img/app/bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    width: calc(100% + 1px);
    cursor: url(https://cur.cursors-4u.net/holidays/hol-4/hol392.cur), auto !important;
}

</style>
