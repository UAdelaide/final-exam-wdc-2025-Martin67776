Vue.component('dog-pic', {
    template: `
    <div>
        <img src="{{ pic }}" alt="Cannot retrieve image">
    </div>
    `,
    data() {
        return {

        };
    },
    mounted() {
        this.fetchImage();
    },
    methods: {
        fetchImage() {
            fetch('https://dog.ceo/api/breeds/image/random', {}).then((res) => {
                
            }).catch((err) => {
                throw err;
            })
        }
    }
});