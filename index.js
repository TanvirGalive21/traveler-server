const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.du8ek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel-agency');
        const serviceCollection = database.collection('services');
        const addbookingCollection = database.collection('addbooking');


       // GET services API
       app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find();
            const services = await cursor.toArray();
            res.send(services);
            
       })

       // add booking API
       app.post("/addbooking", async (req, res) => {
        console.log(req.body);
        const result = await addbookingCollection.insertOne(req.body);
        res.send(result);
      });


      app.get("/addbooking", async (req, res) => {
        const result = await addbookingCollection.find({}).toArray();
        res.send(result);
        console.log(result);
      });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => [
    res.send('Hello from Car Server')
]);

app.listen(port, () =>{
    console.log('Server is Running on port', port)
})