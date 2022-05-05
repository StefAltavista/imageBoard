const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
    // it means that the app runs on heroku
    db = spicedPg(process.env.DATABASE_URL);
} else {
    // the app runs locally
    // const {
    //     DATABASE_USER,
    //     DATABASE_PASSWORD,
    //     DATABASE_NAME,
    // } = require("./secrets.json");
    db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");
    //console.log(`[db] Connecting to: ${DATABASE_NAME}`);
    console.log(`[db] Connecting to: local`);
}

const count = () => {
    return db.query(`SELECT * FROM images;`).then(({ rows }) => {
        return rows.length;
    });
};

const selectAll = (lastid) => {
    return db.query(
        `SELECT * FROM images WHERE id<$1 ORDER BY id DESC LIMIT 6;`,
        [lastid]
    );
};
const select = (id) => db.query(`SELECT * FROM images WHERE id=$1`, [id]);
const insertImg = (imgUrl, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`,
        [imgUrl, username, title, description]
    );
};
const comments = (id) =>
    db.query(`SELECT * FROM comments WHERE comment_id=$1 ORDER BY id DESC`, [
        id,
    ]);
const insertComment = (id, username, comment) => {
    return db.query(
        `INSERT INTO comments (comment_id, username, comment) VALUES ($1, $2, $3) RETURNING *`,
        [id, username, comment]
    );
};
module.exports = {
    count,
    selectAll,
    insertImg,
    select,
    comments,
    insertComment,
};
