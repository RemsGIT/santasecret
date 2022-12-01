<template>
    <img alt="Vue logo" src="./assets/logo.png" />

    <santa-secret  />
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
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
