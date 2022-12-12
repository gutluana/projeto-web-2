const {MongoClient} = require('mongodb');
require('dotenv').config();

console.log("Olha -> "+process.env.mongoUri);
// depois tira essa parte no parenteses, no meu pc nao esta funcionando sem.
// const client = new MongoClient("mongodb+srv://root:luana123@cluster0.lcgbwwd.mongodb.net/?retryWrites=true&w=majority");
// mongoUri = mongodb+srv://root:root@cluster0.dxa1kvh.mongodb.net/?retryWrites=true&w=majority
const client = new MongoClient(process.env.mongoUri);

module.exports = client;