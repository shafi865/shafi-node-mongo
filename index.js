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
        collection.find().limit(150).toArray((err, documents) => {
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


app.get('/product/:key', (req, res) => {
    const key = req.params.key;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onLineStore").collection("products");
        collection.find({key}).limit(150).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({message:err});
            }
            else {
                res.send(documents[0]);
            }
        });
        client.close();
    });
})


app.post('/getProductsByKey', (req, res) => {
    const key = req.params.key;
    const productKeys = req.body;
    console.log(productKeys);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onLineStore").collection("products");
        collection.find({key: {$in: productKeys }}).toArray((err, documents) => {
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
})

//post

app.post("/addProduct", (req, res) => {
    //Save to database

    const product = req.body;
    //console.log(product);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
     const collection = client.db("onLineStore").collection("products");
     collection.insert(product, (err, result)=> {
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

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = new Date();
    console.log(orderDetails);
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
     const collection = client.db("onLineStore").collection("orders");
     collection.insertOne(orderDetails, (err, result)=> {
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


app.listen(3200, () => console.log('Listening to port 3200'));