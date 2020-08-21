const express = require('express');
const line = require('@line/bot-sdk')
const firebase = require('firebase')
const app = express();
const port = process.env.PORT || 3000 ;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/randomAddData', (req, res) => {
    


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

