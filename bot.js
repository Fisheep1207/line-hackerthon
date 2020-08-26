const express = require("express");
const line = require("@line/bot-sdk");
let firebase = require("firebase");
const get_time = require("./modules/get_time");
const firebaseConfig = require("./modules/db_config.js");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
firebase.initializeApp(firebaseConfig);

app.use(express.static("./public"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.set("view engine", "ejs");
let db = firebase.firestore();

const mariadb = require("mariadb");
const con = mariadb.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "w12066021",
    database: "healthdata",
    port: 3306,
});

function get_data(name) {
    return new Promise((resolve, reject) => {
        con.then((conn) => {
            conn.query(`SELECT * FROM ${name}`).then((rows) => {
                //dataFromdb = rows;
                resolve(rows);
            }).catch((err) => {
                reject("No data");
            })
        }).catch(err => {
            reject("Connect fail");
        })
    });
}

app.get("/", (req, res) => {
    res.send("hello world");
});

// firebase verson
// app.get("/users/:who", async (req, res) => {
//     let data = await db.collection(req.params.who).get();
//     let arr = [];
//     data.forEach((doc) => {
//         //console.log(doc.data())
//         arr.push(doc.data());
//     });
//     res.render("default", {
//         title: "首頁",
//         user: req.params.who,
//         datas: arr,
//     });
// });

// mariadb verson
app.get("/users/:who", async (req, res) => {
    let data = await get_data(req.params.who);
    res.render("default", {
        title: "首頁",
        user: req.params.who,
        datas: data,
    });
});

app.post("/API/randomAddData", (req, res) => {
    let name = req.body.name;
    for (let i = 0; i < 10; i++) {
        let time = get_time();
        let pressure = Math.floor(Math.random() * 200) + 50;
        let sugar = Math.floor(Math.random() * 200) + 100;
        db.collection(name).add({
            current_time: time,
            blood_pressure: pressure,
            blood_sugar: sugar,
        });
    }
    res.send(`Random add data to ${name}`);
});

app.get("/allData", async (req, res) => {
    let data = await db.collection("user1").get();
    data.forEach((doc) => {
        console.log(doc.data());
    });
    res.send("Success");
});

app.post("/API/add", (req, res) => {
    db.collection("Fisheep").add({
        current_time: req.body.time,
        blood_pressure: req.body.pressure,
        blood_sugar: req.body.sugar,
    });
    res.send("For test");
});

app.listen(port, () => {
    console.log(`server running at port = ${port}`);
});