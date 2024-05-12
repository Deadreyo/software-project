const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://admin:admin@cluster0.glcx19r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Export the client
module.exports = client;