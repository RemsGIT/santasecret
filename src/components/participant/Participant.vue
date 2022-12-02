<template>
    <div :class="`participant-container ${participant.status}`" @click="discoverPair">
        <p>{{participant.name}}</p>

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
        },
    },
    methods: {
        discoverPair(){
            if(this.participant.status !== 'disabled') {
                this.showSnowGlobe = true
                this.$emit('discovered', this.participant)
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .participant-container {
        border: 1px solid white;

        border-radius: 30px;
        cursor: pointer;
        color: black;
        background-color: #fff;
        transition: .3s;


        &:hover:not(.disabled){
            transform: scale(1.2);
        }

        &.disabled {
            color: gray;
            border-color: gray;
            background-color: transparent ;
            cursor: not-allowed;
        }

        p {
            font-size: 40px;
            font-weight: 900;
            font-family:'Mountains of Christmas' ;
        }
    }
</style>