const express = require("express");
const multer = require("multer");
const db = require("./sql/db");
const path = require("path");
const uidSafe = require("uid-safe");
// ---> require s3 file!
const { upload } = require("./s3");
let imgUrl;

const app = express();
app.use(express.static("./public"));
app.use(express.json());

// multer --> lookup documentation
const storage = multer.diskStorage({
    // specify directory folder for temp uploads
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, "uploads")); // null (if no err!)
    },
    // specify filename
    filename: (req, file, callback) => {
        uidSafe(24).then((randomId) => {
            const fileName = `${randomId}${path.extname(file.originalname)}`; // null (if no err!)
            callback(null, fileName);
        });
    },
});

const uploader = multer({ storage });

app.use(express.urlencoded({ extended: false }));

// route from db to vue
app.get("/images", (req, res) => {
    db.selectAll()
        .then(({ rows }) => {
            // console.log("Server, get/images:\n", rows);
            res.json(rows);
        })
        .catch((err) => {
            res.status(400);
            console.log(err);
        });
});

app.get("/selected/", (req, res) => {
    const { id } = req.query;
    db.select(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((error) => console.log("no image found", error));
});

app.post("/upload_img", uploader.single("image"), upload, (req, res) => {
    const { username, title, description } = req.body;
    imgUrl = "https://s3.amazonaws.com/spicedling/" + req.file.filename;
    if (req.file) {
        db.insertImg(imgUrl, username, title, description).then((img) => {
            console.log("upload succesful");
            res.json(img.rows[0]);
        });
    } else {
        res.json({
            success: false,
        });
    }
});

///comments///

app.get("/comments/", (req, res) => {
    const { id } = req.query;
    db.comments(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((error) => console.log("no comment found", error));
});
app.post("/post_comment", (req, res) => {
    const { id, username, comment } = req.body;
    if (req.body) {
        db.insertComment(id, username, comment).then((x) => {
            console.log("comment succesful");
            res.json(x.rows[0]);
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`Listening to port 8080`));
