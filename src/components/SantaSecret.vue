<template>
    <div class="wrapper" @mousemove="trackMouse">
        <button @click="resetSecretSanta" v-show="false"> RESET </button>

        <div class="torch" :style="torchStyle" :class="{hideTorch: showMauraudersMap}"></div>
        <Transition name="snowball">
            <marauders-map :clicked-name="participantNameClicked" :name="pairToDisplay" v-if="showMauraudersMap" @closeMap="handleCloseMap" />
        </Transition>
        
        <div class="ss-container">
            <div class="ss-participant" v-for="participant in participants" v-bind:key="participant.id">
                <Participant @discovered="handleDiscovered" :participant="participant" :pair="participant.pair !== null ? participants.find(p => p.id === participant.pair) : null"/>
            </div>
        </div>
    </div>
</template>

<script>
import Participant from "@/components/participant/Participant";
import MaraudersMap from "@/components/maraudersMap/MaraudersMap.vue";
export default {
    name: "SantaSecret",
    components: {
        Participant,
        'marauders-map': MaraudersMap
    },
    data () {
        return {
            participants : [
                { id: 0, name: 'Rémy', illegal: [1, 7], status: 'default', pair: null, house:'poufsouffle'},
                { id: 1, name: 'Aurélie', illegal: [0, 5], status: 'default', pair: null, house:'poufsouffle'},
                { id: 2, name: 'Alexis', illegal: [4, 6], status: 'default', pair: null, house:'serdaigle'},
                { id: 3, name: 'Matteo', illegal: [5, 1], status: 'default', pair: null, house:'serpentard'},
                { id: 4, name: 'Léa', illegal: [2, 5, 0], status: 'default', pair: null, house:'gryffondor'},
                { id: 5, name: 'Victoria', illegal: [3, 4, 2], status: 'default', pair: null, house:'serpentard'},
                { id: 6, name: 'Axelle', illegal: [7, 4], status: 'default', pair: null, house:'serdaigle'},
                { id: 7, name: 'Marco', illegal: [6, 3], status: 'default', pair: null, house:'gryffondor'},
            ],
            participantNameClicked: null,
            pairToDisplay: null,
            showMauraudersMap: false,
            mouseX: 0,
            mouseY: 0,
            isTracking: false
        }
    },
    methods: {
        findPairAuto(){ // Search the solution recursively
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
            // Get all available participants and remove their illegal
            let available = this.participants
            available = available.filter(p => p.id !== participant.id && !participant.illegal.includes(p.id));

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
            this.participantNameClicked = value.name
            this.showMauraudersMap =  true;
            this.saveToLocalStorage()
        },
        handleCloseMap(value){
            if(value) {
                this.showMauraudersMap = false
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
        positionParticipantsRandomly() {
            const participants = document.querySelectorAll('.ss-participant');

            participants.forEach(participant => {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const randomLeft = Math.random() * (windowWidth - 100);
                const randomTop = Math.random() * (windowHeight - 100);

                participant.style.left = `${randomLeft}px`;
                participant.style.top = `${randomTop}px`;
            });
        },
        trackMouse(event) {
            this.mouseX = event.pageX - 100; // Ajuster selon la taille de la lampe torche pour la centrer
            this.mouseY = event.pageY - 100; // Ajuster selon la taille de la lampe torche pour la centrer
        },
        
    },
    computed: {
        torchStyle() {
            return {
                top: this.mouseY + 'px',
                left: this.mouseX + 'px'
            };
        }
    },
    beforeMount() { // Get data of localStorage if exists
        if(localStorage.getItem('participants')) {
            this.participants = JSON.parse(localStorage.getItem('participants'))
        }

        this.findPairAuto();
    },
    mounted() {
        this.positionParticipantsRandomly(); // Positionnement initial aléatoire au chargement
        window.addEventListener('resize', this.positionParticipantsRandomly); // Réajustement en cas de redimensionnement de la fenêtre
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.positionParticipantsRandomly); // Nettoyage de l'écouteur d'événement
    }
};
</script>

<style lang="scss">
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    flex-direction: column;
    position: relative;
    //overflow: hidden;
}
.ss-container {
    .ss-participant {
        position: absolute;
        z-index: 10;
        width: 100px;
        height: 34.5px;
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

// torch
.torch {
    position: absolute;
    width: 200px;
    height: 200px;;
    border-radius: 50%;
    background: rgba(255,255,255,.2);
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 9999;
}
.hideTorch {
    display: none;
}
</style>