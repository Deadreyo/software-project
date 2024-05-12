
const client = require('../config/mongo');

const userModel = {
    async create(data) {
        try {
            await client.connect();
            const db = client.db('db');
            const users = db.collection('users');
            await users.insertOne(data);
            const result = await users.findOne({ email: data.email }, { projection: { password: 0 } });
            return result;
        } finally {
            await client.close();
        }
    },
    async findWithPassword(email, password) {
        try {
            await client.connect();
            const db = client.db('db');
            const users = db.collection('users');
            const result = await users.findOne({ email, password }, { projection: { password: 0 } });
            return result;
        } finally {
            await client.close();
        }
    },
    async find(email) {
        try {
            await client.connect();
            const db = client.db('db');
            const users = db.collection('users');
            const result = await users.findOne({ email }, { projection: { password: 0 } });
            return result;
        } finally {
            await client.close();
        }
    },
    async update(email, data) {
        try {
            await client.connect();
            const db = client.db('db');
            const users = db.collection('users');
            const result = await users.updateOne({ email }, { $set: data });
            return result;
        } finally {
            await client.close();
        }
    },
};

module.exports = userModel;