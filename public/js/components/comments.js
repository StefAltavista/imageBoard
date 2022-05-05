const comments = {
    data() {
        return {
            comments: {},
        };
    },
    props: ["selectedImg", "newcomment"],
    template: `<div id="comments">
    <div id="comment" v-for="x in comments">
    <div class="uscom">
    <p class="user" >{{x.username}}__ </p>
    <p class="comment" ><i> "{{x.comment}}"</i></p>
    </div>
           
            
            <p class="date"><time>{{formatDate(x.created_at)}}</time></p>
    </div></div>
    `,
    mounted() {
        const url = `./comments/?id=${this.selectedImg}`;
        console.log("Comments From Mounted Selected: ", url);

        fetch(url).then((com) =>
            com.json().then((com) => {
                this.comments = com;
            })
        );
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        update() {
            this.$parent.$on("update", console.log("child"));
        },
    },
    watch: {
        newcomment: function () {
            const url = `./comments/?id=${this.selectedImg}`;
            console.log("Comments From Mounted Selected: ", url);

            fetch(url).then((com) =>
                com.json().then((com) => {
                    this.comments = com;
                })
            );
        },
    },
};
export default comments;
