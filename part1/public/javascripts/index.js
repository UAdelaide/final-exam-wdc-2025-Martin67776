const DogPic = {
    template: `
    <div>
        <img :src="picLink" alt="Cannot retrieve image">
    </div>
    `,
    data() {
        return {
            picLink: ''
        };
    },
    mounted() {
        this.fetchImage();
    },
    methods: {
        fetchImage() {
            fetch('https://dog.ceo/api/breeds/image/random', {
                method: 'GET'
            }).then((res) => res.json())
            .then((res) => {
                this.picLink = res.message;
            }).catch((err) => {
                throw err;
            });
        }
    }
};

const app = Vue.createApp({});
app.component('dog-pic', DogPic);
app.mount('#container');