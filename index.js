const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cwkrobe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db('photographyService').collection('services')
        const reviewCollection = client.db('photographyService').collection('reviews')

        // show all services in service page 
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        // show details services in details page 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        // show 3 services in home page 
        app.get('/homeservice', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const homeservice = await cursor.limit(3).toArray()
            res.send(homeservice)
        })


        // get all review 
        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.service_id) {
                query = {
                    service_id: req.query.service_id
                }
            }
            console.log(req.query.service_id);
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            console.log(reviews);
            res.send(reviews)
        })


        // get all my review 
        app.get('/addreview', async (req, res) => {
            let query = {};

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = reviewCollection.find(query)
            const addreview = await cursor.toArray()
            res.send(addreview)
        })

        // post review
        app.post('/addreview', async (req, res) => {
            const reviews = req.body
            console.log(reviews);
            const result = await reviewCollection.insertOne(reviews)

            res.send(result)
        })

        //delete review
        app.delete('/addreview/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Delete', id);
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })

        //Edit review
        app.get('/addreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const todo = await reviewCollection.findOne(query)
            res.send(todo)
        })

        app.put('/addreview/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const review = req.body;
            const option = { upsert: true }
            const updateReview = {
                $set: {
                    name: review.name,
                    message: review.message,
                    email: review.email,
                    photoURL: review.photoURL,
                    rating: review.rating
                }
            }
            const result = await reviewCollection.updateOne(filter, updateReview, option)
            res.send(result)
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
    console.log(`PETER McKinnon photography  server running on ${port}`);
})