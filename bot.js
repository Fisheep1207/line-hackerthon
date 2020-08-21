const express = require('express');
const line = require('@line/bot-sdk')
const firebase = require('firebase')
const fullTime = require('./modules/get_time')
console.log(fullTime)
const app = express();
const port = process.env.PORT || 3000 ;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/randomAddData', (req, res) => {
    let data = req.body;
    let name = data.name;
    let pressure = data.blood_pressure;
    let sugar = data.blood_sugar;
    res.send(`name = ${name}, pressure = ${pressure}, sugar = ${sugar}`);
})

app.get('/allData', async (req, res) => {  
    let data = await db.collection('classA').get();
    let userArr = []
    data.forEach((doc) => {
        console.log(doc.data().name)
        userArr.push(doc.data().name);
    })
    res.render('default', {  
        title: '首頁',  
        // users: ['Fisheep', 'Fiona', 'Alice', 'Bob']
        users: userArr
    });  
});

app.listen(port, () => {
    console.log(`server running at port = ${port}`);
})

