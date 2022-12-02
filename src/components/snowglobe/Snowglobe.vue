<template>
    <div class="snow-ball-container" @click="clickOutsideSnowball">
        <div class="snow-ball">
            <div class="snow-globe">
                <div class="ball-container">
                    <div class="cottage">
                        <div class="roof"></div>
                        <div class="window"></div>
                        <div class="chimney">
                            <div id="up" class="smoke"></div>
                            <div id="up" class="smoke2"></div>
                        </div>
                    </div>
                    <div class="snowman">
                        <div class="scarf"></div>
                        <div class="hat"></div>
                    </div>
                    <div class="trees"></div>
                    <div class="trees2"></div>
                    <div class="reflection"></div>
                    <div class="snowfall">
                        <div class="snowflake"></div>
                        <div class="snowflake1"></div>
                        <div class="snowflake2"></div>
                    </div>
                </div>
                <div class="holder">
                    <Transition>
                        <span id="pairName" v-if="showName">{{ name }}</span>
                    </Transition>
                </div>
            </div>
            <div class="shadow"></div>
        </div>
    </div>

</template>

<script>
export default {
    name: "snow-globe",
    data(){
        return {
            showName: false
        }
    },
    props: {
        name: {
            type: String,
        },
    },
    methods: {
        clickOutsideSnowball(e){
            if(!document.querySelector('.snow-ball').contains(e.target)) {
                this.$emit('closeSnowball', true)
            }
        }
    },
    mounted() {
        // Snowglobe displayed
        this.showName = true
    }
};
</script>

<style scoped lang="scss" src="./snowglobe.scss">

</style>