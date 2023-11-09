<template>
    <div
        :class="`participant-container ${participant.status}`"
        @click="discoverPair"
        ref="participantBox"
    >
        <div class="name_container" ref="participantBox">
            <p class="name_txt" :class="{ 'revealed': isTextRevealed }">{{ participant.name }}</p>
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
    }
};
</script>

<style scoped lang="scss">

.participant-container p {
    opacity: 0.06;
    font-size: 30px;
    transition: all .5s;
    font-family: 'Harry Potter', sans-serif;
    user-select: none !important;

    &.revealed {
        opacity: 1;
    }

    &:hover {
        opacity: 1;
        color: black;
    }
}

.participant-container {
    &.disabled {
        .name_txt {
            opacity: 1;
            color: black !important;
            cursor: not-allowed;
        }

    }
}
</style>
