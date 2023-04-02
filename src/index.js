const express = require('express')
const mongoose = require('mongoose');
const route = require('./routes/route')
const app = express()
mongoose.set({strictQuery:true})

app.use(express.json())

mongoose.connect("mongodb+srv://sandy_varanasi:sRzKkk5zN4u6uAZG@sandy-clusture.eimj9vg.mongodb.net/postComment",
{dbName:"postComment"},
{useNewUrlParser:true})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)


app.listen(3000, function() {
    console.log('Express app running on port ' +  3000)
});