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
            fetch('/')
        }
    }
});