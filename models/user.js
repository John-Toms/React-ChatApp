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
            return prepare((await this.Users.find({}).toArray()));
        };

        this.getUserlist = async (fields, value) => {
            return prepare((await this.Users.find({[fields]:value}).toArray()));
        };
        this.insertUser = async fields => {
            const { insertedId } = await this.Users.insertOne(fields);
            return insertedId;
        };

        this.updatePassword = async (selField,value1,tarField,value2) => {
            return prepqre(await this.Users.update(
                {selField:value1},
                {$set: {tarField:value2}}
            ));
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