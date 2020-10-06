const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbj4f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) =>{
    res.send("heroku is working");
});


const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
    const worksCollection = client.db("volunteerNetworkStore").collection("volunteerWorks");
    const registrationCollection = client.db("volunteerNetworkStore").collection("registrationInfo");

    app.post('/addVolunteerWork', (req, res) => {
        const work = req.body;
        console.log(work);
        worksCollection.insertMany(work)
        .then(result => {
            res.send(result);
            console.log(result.insertedCount);
        })
    });

    app.get('/workDetails', (req, res) => {
        worksCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/addRegistrationInfo', (req, res) => {
        const registrationInfo = req.body;
        console.log(registrationInfo);
        registrationCollection.insertOne(registrationInfo)
        .then(result => {
            res.send(result);
            console.log(result.insertedCount);
        })
    });

    app.get('/registerInfo', (req, res) => {
        registrationCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
});



app.listen(process.env.PORT || port);