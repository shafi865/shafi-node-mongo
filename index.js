const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();

app.use(cors());
app.use(bodyParser.json());


const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

const users = ["Jhankar", "ProRasel", "CyanTarek", "Shafiq"];


/*const  rootCall = (req, res) => {
    res.send('Thank')
}*/

app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onLineStore").collection("products");
        collection.find().limit(15).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({message:err});
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});

app.get('/fruits/banana', (req, res) => {
    res.send({ fruit: 'banana', quantity: 1000, price: 4000 });
});


app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const name = users[userId];
    res.send({ userId, name });
})


//post

app.post("/addProduct", (req, res) => {
    //Save to database

    const product = req.body;
    //console.log(product);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
     const collection = client.db("onLineStore").collection("products");
     collection.insertOne(product, (err, result)=> {
     if(err){
         console.log(err)
     }
     else{
     res.send(result.ops[0]);
     }
     });
    client.close();
 });


});


app.listen(3000, () => console.log('Listening to port 3000'));
