<template>
    <div class="wrapper">
        <button @click="resetSecretSanta"> RESET </button>
        <div class="ss-container">
            <div class="ss-participant" v-for="participant in participants" v-bind:key="participant.id">
                <Participant :participant="participant" @discoverPair="handleDiscoverPair"/>
            </div>
        </div>

    </div>
</template>

<script>
import Participant from "@/components/participant/Participant";

export default {
    name: "SantaSecret",
    components: {
         Participant
    },
    data () {
        return {
            participants : [
                { id: 0, name: 'Rémy', illegal: 1, status: 'default'},
                { id: 1, name: 'Aurélie', illegal: 0, status: 'default'},
                { id: 2, name: 'Alexis', illegal: 4, status: 'default'},
                { id: 3, name: 'Matteo', illegal: 5, status: 'default'},
                { id: 4, name: 'Léa', illegal: 2, status: 'default'},
                { id: 5, name: 'Victoria', illegal: 3, status: 'default'},
                { id: 6, name: 'Axelle', illegal: 7, status: 'default'},
                { id: 7, name: 'Marco', illegal: 6, status: 'default'},
            ],
        }
    },
    methods: {
        handleDiscoverPair(value) {
            alert('Discover : ' + value.name + " can't offer gift to : " + this.participants.find(p => p.id === value.illegal).name)

            this.participants.find(p => p.id === value.id).status = 'disabled'

            // Save to localStorage
            localStorage.setItem('participants', JSON.stringify(this.participants))
        },
        resetSecretSanta(){
            this.participants.forEach(element => {
                element.status = 'default'
            })

            localStorage.clear();
        }
    },
    beforeMount() {
        if(localStorage.getItem('participants')) {
            this.participants = JSON.parse(localStorage.getItem('participants'))
        }
    }
};
</script>

<style scoped lang="scss">
.ss-container {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 50px;
}
</style>