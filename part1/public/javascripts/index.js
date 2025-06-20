const DogPic = {
    template: `
    <div>
        <button type="button" @click="counter+1">Click 100 times to see the picture</button>
        <img :src="picLink">
    </div>
    `,
    data() {
        return {
            picLink: '',
            counter: 0
        };
    },
    mounted() {
        this.fetchImage(0);
    },
    methods: {
        fetchImage(count) {
            if (count > 100) {

            }

        }
    }
};

const app = Vue.createApp({});
app.component('dog-pic', DogPic);
app.mount('#container');