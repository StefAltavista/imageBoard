import * as Vue from "./vue.js";
import * as select from "./components/select.js";

const { imgdetail } = select;

const app = Vue.createApp({
    data() {
        return {
            images: [],
            updatingScroll: false,
            title: "",
            username: "",
            description: "",
            img: "",
            end: false,
            load: false,
            selectedImg: location.search.slice(4) || location.pathname.slice(1),
        };
    },
    created() {
        window.addEventListener("popstate", () => {
            this.handleURL(location.search);
        });

        window.addEventListener("scroll", () => this.scrollUpdate());
    },
    destroyed() {
        console.log("IN DESTROYED!!!!");
    },
    mounted() {
        fetch("/images", {
            method: "POST",
        })
            .then((res) => res.json())
            .then((imgData) => {
                this.images = imgData;
                this.title = imgData.title;
            });
    },
    methods: {
        handleURL() {
            this.selectedImg = location.search.slice(4);
        },
        handleSubmit(e) {
            e.preventDefault();
            // create Data with right encoding
            const formData = new FormData();
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);
            formData.append("image", this.img);
            this.load = true;
            // trigger an ajax request to the server
            fetch("/upload_img", {
                method: "POST",
                body: formData,
            })
                .then((uploadedImg) => uploadedImg.json())
                .then((uploadedImg) => {
                    this.images.unshift(uploadedImg);
                    this.load = false;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        handleFileChange(e) {
            this.img = e.target.files[0];
        },
        selected(img) {
            this.selectedImg = img;
            history.pushState({}, "", `/?id=${img}`);
        },
        closeDetail() {
            this.selectedImg = null;
            history.pushState({}, "", "/");
        },
        scrollUpdate() {
            let documentH = document.body.scrollHeight;
            let currentScroll = window.scrollY + window.innerHeight;

            if (currentScroll + 10 >= documentH && this.end == false) {
                const lastId = this.images[this.images.length - 1].id;
                const reqBody = JSON.stringify({ lastId: lastId });

                fetch("/images", {
                    headers: {
                        "Content-type": "application/json",
                    },
                    method: "POST",
                    body: reqBody,
                })
                    .then((res) => res.json())
                    .then((imgData) => {
                        if (imgData.length == 0) {
                            this.end = true;
                        }
                        this.images.push(...imgData);
                    });
            }
        },
    },
    components: {
        imgdetail: imgdetail,
    },
}).mount("#main");
