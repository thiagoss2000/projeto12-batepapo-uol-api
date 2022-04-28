import express, { json } from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(json());

let dataBase = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
const promise = mongoClient.connect();

promise.then(() => {
    dataBase = mongoClient.db("dados");
})

app.post('/participants',async (request, response) => {
    try {
        const participant = await request.body;
        dataBase.collection("dados").insertOne({"name" : participant.name, "lastStatus" : Date.now()});
        response.sendStatus(201);
    }
    catch {
        response.sendStatus(400);
    }
});

app.get('/participants',async (request, response) => {
    const participants = await dataBase.collection("dados").find({}).toArray();
    response.send(participants);
})

app.post('/messages',async (request, response) => {

})

app.get('/messages',async (request, response) => {
    
})

app.listen(5000, () => {
    console.log("server on");
})