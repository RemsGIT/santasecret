<template>
    <div class="wrapper">
        <Garland class="garland top"/>
        <div class="ss-container">
            <div class="ss-participant" v-for="participant in participants" v-bind:key="participant.id">
                <Participant @discovered="handleDiscovered" :participant="participant" :pair="participant.pair !== null ? participants.find(p => p.id === participant.pair) : null"/>
            </div>
        </div>
        <button @click="resetSecretSanta" style="display: none"> RESET </button>
        <img class="tree left" src="../../public/img/app/tree.png" alt="">
        <img class="tree right" src="../../public/img/app/tree.png" alt="">


        <Transition name="snowball">
            <snow-globe :name="pairToDisplay" v-if="showSnowGlobe" @closeSnowball="handleCloseSnowball"/>
        </Transition>

    </div>
</template>

<script>
import Participant from "@/components/participant/Participant";
import Garland from "@/components/garland/Garland";
import Snowglobe from "@/components/snowglobe/Snowglobe";
export default {
    name: "SantaSecret",
    components: {
        Participant,
        Garland,
        'snow-globe': Snowglobe
    },
    data () {
        return {
            participants : [
                { id: 0, name: 'Rémy', illegal: 1, status: 'default', pair: null},
                { id: 1, name: 'Aurélie', illegal: 0, status: 'default', pair: null},
                { id: 2, name: 'Alexis', illegal: 4, status: 'default', pair: null},
                { id: 3, name: 'Matteo', illegal: 5, status: 'default', pair: null},
                { id: 4, name: 'Léa', illegal: 2, status: 'default', pair: null},
                { id: 5, name: 'Victoria', illegal: 3, status: 'default', pair: null},
                { id: 6, name: 'Axelle', illegal: 7, status: 'default', pair: null},
                { id: 7, name: 'Marco', illegal: 6, status: 'default', pair: null},
            ],
            pairToDisplay: null,
            showSnowGlobe: false
        }
    },
    methods: {
        findPairAuto(){
            if(!localStorage.getItem('participants')) {
                this.participants.forEach((participant,index) => {
                    if(!this.findPair(participant)){
                        this.resetSecretSanta()
                    }
                    else if(index === 7) { // Good and last one
                        console.log('finished')
                        this.saveToLocalStorage();
                    }
                })
            }
        },
        findPair(participant) {
            // Get all available participants
            let available = this.participants
            available = available.filter(p => p.id !== participant.id && p.id !== participant.illegal);

            // Find the pairs and remove them --> two persons can't give a gift to the same person
            this.participants.forEach(element => {
                if(element.pair !== null) {
                    let index = available.findIndex(a => a.id === element.pair);
                    if(index >= 0) {
                        // Remove from available, people whom already receive a gift
                        available.splice(available.findIndex(a => a.id === element.pair), 1)
                    }
                }
            })

            const randomPair = available[Math.floor(Math.random()*available.length)]

            // Save the pair
            try {
                participant.pair = randomPair.id
                return true;
            }
            catch(e) {
                // Relancer le programme
                return false;
            }
        },
        handleDiscovered(value){
            this.participants.find(p => p.id === value.id).status = 'disabled'

            this.pairToDisplay = this.participants.find(p => p.id === value.pair).name

            this.showSnowGlobe =  true;
            this.saveToLocalStorage()
        },
        handleCloseSnowball(value){
            if(value) {
                this.showSnowGlobe = false
            }

        },
        saveToLocalStorage(){
            // Save to localStorage
            localStorage.setItem('participants', JSON.stringify(this.participants))
        },
        resetSecretSanta(){
            this.participants.forEach(element => {
                element.status = 'default'
                element.pair = null
            })
            localStorage.clear();

            this.findPairAuto();
        },
    },
    beforeMount() { // Get data of localStorage if exists
        if(localStorage.getItem('participants')) {
            this.participants = JSON.parse(localStorage.getItem('participants'))
        }

        this.findPairAuto();
    }
};
</script>

<style lang="scss">
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;

    position: relative;
    overflow: hidden;

}
.tree {
    width: 500px;
    position: absolute;
    z-index: 0;

    &.left{
        left: -180px;
        bottom: -100px;
    }
    &.right{
        width: 550px;
        right: -180px;
        bottom: -40px;
    }


}
.garland {
    position: absolute;
    top: 20px;
}
.ss-container {
    margin-top: 7%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 50px;

    width: 55%;

    .ss-participant {
        z-index: 10;
    }
}

.snowball-enter-active,
.snowball-leave-active {
    transition: opacity 0.3s ease;
}

.snowball-enter-from,
.snowball-leave-to {
    opacity: 0;
}
</style>