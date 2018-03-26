'use strict';

function prepare(o) {
    if (o && o._id) {
        o._id = o._id.toString();
    }
    return o;
}

class ChatModel{
    constructor(db,ObjectId) {

        this.getMessages = async ( value1,value2,starttime,endtime) => {
            return prepare((await this.Users.find({"sender":{"$in":[value1,value2]},"receiver":{"$in":[value1,value2]},"date": {
                $gte: starttime,
                 $lte: endtime,}}).toArray()));
                // return prepare((await this.Users.find({"sender": {"$in": [value1,value2]},"receiver": {"$in": [value1,value2]},"date": {
                //     $gte: starttime,
                //     $lte: endtime,}}).toArray()));
                // db.getCollection('messages').find({"sender":{"$in":["test1@test.com","test3@test.com"]},"receiver":{"$in":["test1@test.com","test3@test.com"]}})
        };
        this.saveMessage = async fields => {
            const { insertedId } = await this.Users.insertOne(fields);
            return insertedId;
        };


        if (!db) {
            throw new Error('DB is required.');
        }
        this.db = db;
        if (!ObjectId) {
            throw new Error('ObjectId is required.');
        }

        this.ObjectId = ObjectId;
        this.Users = this.db.collection('messages');
    }
}


module.exports = ChatModel;