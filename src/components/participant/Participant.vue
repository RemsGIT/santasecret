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
    .participant-container p{
        opacity: 1;
        transition: 1s ease-in-out;
        font-size: 50px;
        
        &:hover {
            opacity: 1;
        }
        
        &.disabled {
            opacity: 1;
            color: gray;
            cursor: not-allowed;
        }
    }
</style>