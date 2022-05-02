import express, { json } from "express";
import cors from 'cors';
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
import Joi from "joi";

// const messageSchema = Joi.object({
//     to: Joi.string().required(),
//     text: Joi.string().required(),
//     type: ['message', 'private_message']
// })

// const participantSchema = Joi.object({
//     name: Joi.string().required()
// })

const app = express();
app.use(json());
app.use(cors());

let dataBase = null;
const mongoClient = new MongoClient('mongodb://localhost:27017');
const promise = mongoClient.connect();

promise.then(() => {
    dataBase = mongoClient.db("dados");
    console.log('opaikdfsgu')
})
promise.catch((e) => console.log(e));
// app.post('/participants',async (request, response) => {
//     try {
//         const participant = await request.body;
//         const participants = await dataBase.collection("dados").find({}).toArray();
//         if(participants.some((el) => el.name == participant.name)){
//             response.sendStatus(409);
//             return;
//         }
//         const { error, value } = participantSchema.validate(participant);
//         if(!error){
//             dataBase.collection("dados").insertOne({"name" : value.name, "lastStatus" : Date.now()});
//             response.sendStatus(201);
//         }
//     }
//     catch(err) {
//         response.status(422).send(err);
//     }
// });

// app.get('/participants',async (request, response) => {
//     const participants = await dataBase.collection("dados").find({}).toArray();
//     response.send(participants);
// })

// app.post('/messages',async (request, response) => {
//     try {
//         const { body, headers } = request;
//         console.log(headers.user);
//         const participants = await dataBase.collection("dados").find({}).toArray();
//         if(!participants.some((el) => el.name == headers.user)){
//             response.sendStatus(409);  // mudar 
//             return;
//         }
//         const { error, value } = messageSchema.validate(body);
//         if(!error){
//             dataBase.collection("dados").insertOne({});
//             response.sendStatus(201);
//         }
//         console.log(value);
//     }
//     catch(err) {
//         response.status(400).send(err);
//     }
// })

// app.get('/messages',async (request, response) => {
//     const { query } = request
//     const limit = query.limit;
//     console.log(limit);
//     try {
//         if(limit){
//             console.log('werkjfns')
//             return; 
//         }                   
//         // const messages = dataBase.collection("").find({})
    
//         response.status(200).send({'limit': limit});
//     } catch {
//         response.sendStatus(500);
//     }
// })

// app.post('/status', async (request, response) => {
//     const { headers } = request;
//     try {
//         const participants = await dataBase.collection("dados").find({}).toArray();
//         if(!participants.some((el) => el.name == headers.user)){
//             response.sendStatus(404);  
//             return;
//         }
//         // dataBase.collection("dados").updateOne(
//         //     {_id: headers.user._id },{ $set: req.body }
//         // );
//     } catch {
//         response.sendStatus(500);
//     }

// })

app.listen(5000, () => {
    console.log("server on");
})