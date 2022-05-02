import express, { json } from "express";
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
import Joi from "joi";
import dayjs from "dayjs";

const messageSchema = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: ['message', 'private_message']
})

const participantSchema = Joi.object({
    name: Joi.string().required()
})

const app = express();
app.use(json());
app.use(cors());

let dataBase = null;
const mongoClient = new MongoClient('mongodb://localhost:27017');
const promise = mongoClient.connect();
promise.then(() => {
    dataBase = mongoClient.db("dados");
    console.log('banco conectado');
})

app.post('/participants',async (request, response) => {
    try {
        const participant = await request.body;

        const participants = await dataBase.collection("participantsDB").find({}).toArray();

        if(participants.some((el) => el.name == participant.name)){
            response.sendStatus(409);
            return;
        }
        const { error, value } = participantSchema.validate(participant);
        if(!error){
            dataBase.collection("participantsDB").insertOne({"name" : value.name, "lastStatus" : Date.now()});
            response.sendStatus(201);
        }
    }
    catch(err) {
        response.status(422).send(err);
    }
});

app.get('/participants',async (request, response) => {
    const participants = await dataBase.collection("participantsDB").find({}).toArray();
    response.send(participants);
})

app.post('/messages',async (request, response) => {
    try {
        const { body, headers } = request;
        const participants = await dataBase.collection("participantsDB").find({}).toArray();
        if(!participants.some((el) => el.name == headers.user)){
            response.sendStatus(404);  // mudar 
            return;
        }
        const { error, value } = messageSchema.validate(body);
        if(!error){
            dataBase.collection("messagesDB").insertOne({
                'from': headers.user, 
                'to': value.to, 
                'text': value.text, 
                'type': value.type,
                'time': dayjs().format('HH:mm:ss')
            });
            response.sendStatus(201);
            return;
        }
        response.sendStatus(422);
    }
    catch(err) {
        response.status(400).send(err);
    }
})

app.get('/messages',async (request, response) => {
    const { query, headers } = request
    const limit = query.limit;
    const messages = await dataBase.collection("messagesDB").find({}).toArray();
    try {
        const messagesPassed = messages.filter((el) => (el.from == headers.user || el.to == headers.user || el.type == 'message'));
        if(limit){
            let messagesSelect = [];
            for(let i = messagesPassed.length -1; i >= messagesPassed.length - limit; i --){
                messagesSelect.push(messagesPassed[i]);
            }
            response.status(200).send(messagesSelect);
            return; 
        }                   
        response.status(200).send(messagesPassed.reverse());
    } catch {
        response.sendStatus(500);
    }
})

app.post('/status', async (request, response) => {
    const { headers } = request;
    try {
        const participants = await dataBase.collection("statusDB").find({}).toArray();
        if(!participants.some((el) => el.name == headers.user)){
            response.sendStatus(404);  
            return;
        }
        // dataBase.collection("statusDB").updateOne(
        //     {_id: headers.user._id },{ $set: req.body }
        // );
    } catch {
        response.sendStatus(500);
    }

})

app.listen(5000, () => {
    console.log("server on");
})