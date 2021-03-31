const express = require('express')
const app = express()
const port = process.env.PORT || 5555;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)