<template>
    <div
        :class="`participant-container ${participant.status}`"
        @click="discoverPair"
        ref="participantBox"
    >
        <div class="name_container" ref="participantBox" :class="{ 'revealed': isTextRevealed }">
            <p class="name_txt" >{{ participant.name }}</p>
            <img :src="`/img/app/hp_house/${participant.house}.png`" class="participant-house" alt="">
        </div>
    </div>
</template>

<script>
export default {
    name: "ss-Participant",
    props: {
        participant: {
            type: Object,
            required: true
        },
        pair: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            isTextRevealed: false
        };
    },
    methods: {
        discoverPair() {
            if (this.participant.status !== 'disabled') {
                this.showSnowGlobe = true;
                this.$emit('discovered', this.participant);
            }
        },
    },
    mounted() {
        console.log(this.participant);
    }
};
</script>

<style scoped lang="scss">

.participant-house {
    position: absolute;
    top: -5px;
    opacity: 0;
    width: 100%;
    z-index: 0;
    transition: all .5s;

}

.participant-container {
    position: relative;

    &:hover  {
        p {
            opacity: 1;
            color: black;
        }
        .participant-house {
            opacity: 0.5;
        }

    }
    
    &.disabled {
        .name_txt {
            opacity: 1;
            color: black !important;
            cursor: not-allowed;
        }
        
        .participant-house {
            opacity: 0.7;
        }

    }
    
    p {
        opacity: 0.06;
        font-size: 30px;
        transition: all .5s;
        font-family: 'Harry Potter', sans-serif;
        user-select: none !important;
        position: absolute;
        z-index: 100;
        left: 50%;
        transform: translate(-50%);

        &.revealed {
            opacity: 1;
        }
    }
    
}
</style>
