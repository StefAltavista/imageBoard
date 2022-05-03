const comments = {
    data() {
        return {
            comments: {},
        };
    },
    props: ["selectedImg", "newcomment"],
    template: `<div id="comments">
    <div id="comment" v-for="x in comments">
            <p class="user" > user: {{x.username}}</p>
            <p class="comment" >{{x.comment}}</p>
            <p class="date">{{x.created_at}}</p>
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
        update() {
            this.$parent.$on("update", console.log("child"));
        },
    },
    watch: {
        newcomment: function (arMsg) {
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
