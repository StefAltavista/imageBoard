const addComment = {
    data() {
        return {
            com: {},
            user: "",
            comment: "",
        };
    },
    props: ["selectedImg"],
    template: `
    <form id="newcomment" @submit="postComment">
            username:<input v-model="user" name="user"/>
            comment:<textarea v-model="comment" name="comment"/>
            <button>submit</button>
    </form>
    `,
    mounted() {},
    methods: {
        postComment(e) {
            e.preventDefault();

            // trigger an ajax request to the server
            const data = {
                id: this.selectedImg,
                username: this.user,
                comment: this.comment,
            };
            console.log("ready to fetch:", data);
            fetch("/post_comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((com) => com.json())
                .then(() => {
                    this.$emit("new-comment");
                });
        },
    },
};

export default addComment;
