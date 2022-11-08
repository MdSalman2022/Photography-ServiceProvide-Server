const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cwkrobe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db('photographyService').collection('services')


        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/homeservice', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const homeservice = await cursor.limit(3).toArray()
            res.send(homeservice)
        })


        //to create a service
        app.post('/services', async (req, res) => {
            const services = req.body
            console.log(services);
            const result = await serviceCollection.insertOne(services)

            res.send(result)
        })


    }
    finally {

    }


}
run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('PETER McKinnon photography server is running')
})

app.listen(port, () => {
    console.log(`Genius car server running on ${port}`);
})