const DogPic = {
    template: `
    <div>
        <button type="button" @click="fetchImage(counter++)">Click 10 times to see a new picture</button>
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
            if (count === 9) {
                fetch('https://dog.ceo/api/breeds/image/random', {
                    method: 'GET'
                }).then((res) => res.json())
                .then((res) => {
                    this.picLink = res.message;
                }).catch((err) => {
                    throw err;
                });
                this.counter = 0;
            }
        }
    }
};

const app = Vue.createApp({});
app.component('dog-pic', DogPic);
app.mount('#container');