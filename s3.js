const aws = require("aws-sdk");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./config.json");
    console.log("here:", secrets);
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("User didn't send any file");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;
    console.log("FILE:\n", filename, mimetype, size, path);
    s3.putObject({
        Bucket: "spicedling",
        ACL: "public-read", // makes sure what we upload can be access online
        Key: filename, // is responsible for the name of the object created in the bucket
        Body: fs.createReadStream(path), // stream to where the file is that we like to upload
        ContentType: mimetype, // ensures that under the hood content type headers can be set
        ContentLength: size, // and most likely also content length headers
    })
        .promise()
        .then(() => {
            console.log("img uploaded in aws cloud!");
            next();
            fs.unlink(path, () => {});
        })
        .catch((err) => console.log("cloud upload failed!", err));
};
