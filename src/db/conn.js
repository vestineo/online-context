// Retrieve
import { MongoClient, ObjectId } from 'mongodb'

// Connect to the db
const client = new MongoClient("mongodb://localhost:27017");

let _db;

export const dbo =  {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        _db = db.db("onlineContext");
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
         });
  },
  objId: ObjectId,
  getDb: function () {
    return _db;
  },
};
