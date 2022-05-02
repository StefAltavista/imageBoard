import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            created_at: "",
        };
    },
    mounted() {
        fetch("/images")
            .then((res) => res.json())
            .then((imgData) => {
                console.log("fetching /images: imgData:", imgData[0].title);
                this.images = imgData;
                this.title = imgData.title;
            });
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            console.log("HERE!");
            // create Data with right encoding
            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);
            formData.append("image", this.img);

            // trigger an ajax request to the server
            fetch("/upload_img", {
                method: "POST",
                body: formData,
            })
                .then((uploadedImg) => uploadedImg.json())
                .then((uploadedImg) => {
                    this.images.unshift(uploadedImg);
                });
        },
        handleFileChange(e) {
            console.log("Change File\t", e.target.files[0]);
            this.img = e.target.files[0];
        },
        loading(e) {
            console.log("Loading...");
            this.img = e.target.files[0];
        },
    },
}).mount("#main");
