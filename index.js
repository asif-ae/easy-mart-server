// Main (required)
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// dotENV (required)
const port = process.env.PORT || 5555;
const name = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_MAIN;
const dbCollection = process.env.DB_COLL;
const ocCollection = process.env.DB_ORCO;
const uri = `mongodb+srv://${name}:${pass}@cluster0.lq9rh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

// Set connection with database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connection error:', err);
  // Product Collections
  const productsCollection = client.db(dbName).collection(dbCollection);
  console.log('Database Connected Successfully!', productsCollection);
  
  

  // Product Collections Setup
  app.get('/products', (req, res) => {
    productsCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.find({_id: id})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productsCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result);
    })
  })

  app.patch('/update/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.updateOne(
      {_id: id},
      {
        $set: {name: req.body.productName, weight: req.body.weight, price: req.body.addPrice}
      }
    )
    .then(result => {
      console.log('updated');
    })
  })


  // Order Collections
  const ordersCollection = client.db(dbName).collection(ocCollection);
  console.log(ordersCollection);


  // Order Collections Setup
  app.post('/addOrders', (req, res) => {
    const newOrder = req.body;
    console.log(newOrder);
    ordersCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // client.close();
});



app.listen(port)