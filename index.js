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
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.find({_id: id})
    .toArray((err, documents) => {
      res.send(documents);
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

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result);
    })
  })

  app.patch('/update/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productCollection.updateOne(
      {_id: id},
      {
        $set: {name: req.body.productName, weight: req.body.weight, price: req.body.addPrice}
      }
    )
    .then(result => {
      console.log('updated');
    })
  })

  // client.close();
});



app.listen(port)