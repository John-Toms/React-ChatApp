'use strict';

function prepare(o) {
    if (o && o._id) {
        o._id = o._id.toString();
    }
    return o;
}

class UserModel{
    constructor(db,ObjectId) {
        this.getUserById = async id => {
            const user = await this.Users.findOne(this.ObjectId(id));
            return prepare(user);
        };

        this.getUser = async () => {
            return prepare((await this.Users.find({},{_id:1,username:1,sex:1}).toArray()));
        };

        this.getUserContact = async (contacts) => {
            var contactArray = contacts.split(",");
            var value = [];
            for(var i=0; i<contactArray.length; i++){
                value.push(ObjectId(contactArray[i]));
            }
            return prepare((await this.Users.find({"_id": {"$in": value}},{_id:1,username:1,sex:1}).toArray()));
        };

        this.getUserlist = async (fields, value) => {
            return prepare((await this.Users.find({[fields]:value}).toArray()));
        };

        this.insertUser = async fields => {
            const { insertedId } = await this.Users.insertOne(fields);
            return insertedId;
        };

        this.getValue = async (selField,value,tarField) => {
            return prepare((await this.Users.find({[selField]:value},{[tarField]:1}).toArray()));
        };

        this.updateValue = async (selField,value1,tarField,value2) => {
            return await this.Users.update(
                {[selField]:value1},
                {$set: {[tarField]:value2}},
                {upsert:false,multi:true} 
            );
        };

        if (!db) {
            throw new Error('DB is required.');
        }
        this.db = db;
        if (!ObjectId) {
            throw new Error('ObjectId is required.');
        }

        this.ObjectId = ObjectId;
        this.Users = this.db.collection('userlist');
    }
}


module.exports = UserModel;