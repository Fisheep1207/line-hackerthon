"use strict";

var express = require("express");

var line = require("@line/bot-sdk");

var firebase = require("firebase");

var get_time = require("./modules/get_time");

var firebaseConfig = require("./modules/db_config.js");

var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;
firebase.initializeApp(firebaseConfig);
app.use(express["static"]("./public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
var db = firebase.firestore();

var mariadb = require("mariadb");

var con = mariadb.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "w12066021",
  database: "healthdata",
  port: 3306
});

function get_data(name) {
  return new Promise(function (resolve, reject) {
    con.then(function (conn) {
      conn.query("SELECT * FROM ".concat(name)).then(function (rows) {
        //dataFromdb = rows;
        resolve(rows);
      })["catch"](function (err) {
        reject("No data");
      });
    })["catch"](function (err) {
      reject("Connect fail");
    });
  });
}

app.get("/", function (req, res) {
  res.send("hello world");
}); // firebase verson
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

app.get("/users/:who", function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(get_data(req.params.who));

        case 2:
          data = _context.sent;
          res.render("default", {
            title: "首頁",
            user: req.params.who,
            datas: data
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post("/API/randomAddData", function (req, res) {
  var name = req.body.name;

  for (var i = 0; i < 10; i++) {
    var time = get_time();
    var pressure = Math.floor(Math.random() * 200) + 50;
    var sugar = Math.floor(Math.random() * 200) + 100;
    db.collection(name).add({
      current_time: time,
      blood_pressure: pressure,
      blood_sugar: sugar
    });
  }

  res.send("Random add data to ".concat(name));
});
app.get("/allData", function _callee2(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(db.collection("user1").get());

        case 2:
          data = _context2.sent;
          data.forEach(function (doc) {
            console.log(doc.data());
          });
          res.send("Success");

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post("/API/add", function (req, res) {
  db.collection("Fisheep").add({
    current_time: req.body.time,
    blood_pressure: req.body.pressure,
    blood_sugar: req.body.sugar
  });
  res.send("For test");
});
app.listen(port, function () {
  console.log("server running at port = ".concat(port));
});