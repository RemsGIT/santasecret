<template>
    <div class="marauders_map_container">
        <div class="main-content" >
            <div class="map-base " @click="clickStartAnimation" :class="{active: startAnimation}">
                <div class="footsteps footsteps-1">
                    <div class="footstep left"></div>
                    <div class="footstep right"></div>
                    <div class="scroll-name">
                        <span id="pairName" v-if="showName">{{name}}</span>
                        <span v-else>Qui est-ce ?</span>
                    </div>
                </div>
                <div class="footsteps footsteps-2">
                    <div class="footstep left"></div>
                    <div class="footstep right"></div>
                    <div class="scroll-name">
                        <p class="clickedNameTxt">{{clickedName}}</p>
                    </div>
                </div>
                <div class="map-flap flap--1">
                    <div class="map-flap__front"></div>
                    <div class="map-flap__back"></div>
                </div>
                <div class="map-flap flap--2">
                    <div class="map-flap__front"></div>
                    <div class="map-flap__back"></div>
                </div>
                <div class="map-side side-1">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/8.png')"></div>
                    <div class="back"></div>
                </div>
                <div class="map-side side-2">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/18.png')"></div>
                    <div class="back"></div>
                </div>
                <div class="map-side side-3">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/7.png')"></div>
                    <div class="back"></div>
                </div>
                <div class="map-side side-4">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/10.png')"></div>
                </div>
                <div class="map-side side-5">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/6.png')"></div>
                    <div class="back"></div>
                </div>
                <div class="map-side side-6">
                    <div class="front" style="--image: url('https://meowlivia.s3.us-east-2.amazonaws.com/codepen/map/11.png')"></div>
                    <div class="back"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "marauders-map",
    data(){
        return {
            showName: false,
            startAnimation : false
        }
    },
    props: {
        clickedName: {
            type: String
        },
        name: {
            type: String,
        },
    },
    methods: {
        clickOutsideSnowball(e){
            if(!document.querySelector('.snow-ball').contains(e.target)) {
                this.$emit('closeSnowball', true)
            }
        },
        clickStartAnimation() {
            this.startAnimation = true
        }
    },
    mounted() {
        // Snowglobe displayed
        setTimeout(() => this.showName = true, 16000)
    }
};
</script>

<style scoped lang="scss" src="./marauders_map.scss" />