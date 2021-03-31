// Main (required)
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// dotENV (required)
const port = process.env.PORT || 5555;
const name = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_MAIN;
const dbCollection = process.env.DB_COLL;
const uri = `mongodb+srv://${name}:${pass}@cluster0.lq9rh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

// Set connection with database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connection error:', err);
  const productCollection = client.db(dbName).collection(dbCollection);
  console.log('Database Connected Successfully!');

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items)
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct);
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // client.close();
});



app.listen(port)