import addComment from "./addComment.js";
import comments from "./comments.js";

const imgdetail = {
    data() {
        return {
            selected: {},
            comments: {},
            newcomment: 0,
        };
    },
    props: ["selectedImg"],
    template: `
    <div id="overlay" @click="close"> 
        <div id="overview">
            <aside>
                <h6>Title:</h6>
                <h3>{{selected.title}}</h3>
                <h6>Description:</h6>
                <p>{{selected.description}}</p>
                <h6>created by:</h6>
                <p>{{selected.username}}</p>
                <h6>Date:</h6>
                <p>{{formatDate(selected.created_at)}} </p>
                <add-comment :selected-img="selectedImg" :comments="comments" @new-comment="updateComments"></add-comment>
            </aside>
            
            <img :src="selected.url" />
            <comments :selected-img="selectedImg" :newcomment="newcomment" ></comments>
        </div>
    </div>
    `,
    mounted() {
        const url = `./selected/?id=${this.selectedImg}`;
        console.log("From Mounted Selected: ", url);

        fetch(url).then((detail) =>
            detail.json().then((detail) => {
                console.log("Image found: ", detail[0]);
                this.selected = detail[0];
            })
        );
    },

    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        updateComments() {
            console.log("parent emit");
            this.newcomment++;
            this.$emit("update");
        },
        close(e) {
            if (e.target.id == "overlay") {
                console.log("close");
                this.$emit("close-selected");
            }
        },
    },
    components: {
        "add-comment": addComment,
        comments: comments,
    },
};

export { imgdetail };
