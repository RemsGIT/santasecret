<template>
    <div :class="`participant-container ${participant.status}`" @click="discoverPair(participant)">
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
    },
    methods: {
        discoverPair(participant){
            if(participant.status !== 'disabled') {
                this.$emit('discoverPair', participant)
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .participant-container {
        border: 1px solid gray;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 10px;
        cursor: pointer;

        &.disabled {
            color: #ffffff;
            background-color: #9f9f9f;
            cursor: not-allowed;
        }
    }
</style>