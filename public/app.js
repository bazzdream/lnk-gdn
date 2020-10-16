const app = new Vue({
    el: '#app',
    data: {
        url: "",
        slug: "",
        created: null
    }, 
    methods: {
        async createUrl() {
            console.log(this.url, this.slug);
            const response = await fetch('/url', {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug
                })
            })

            this.created = await response.json()
        }
    }
})