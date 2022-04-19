import { MongoClient } from 'mongodb'

const client = new MongoClient("mongodb://localhost:27017");

client.connect()

let db = client.db('onlineContext');
let users = db.collection('users');

export const getUserByName = (username) => {
	return users.findOne({name : username})  
}

export const addUser = async (user) => {
	try { 
		const result = await getUserByName(user.name);
		if(result === null){
			users.insertOne(user, (err,res) => {
				if(err) throw err;
				return 'added';
			})
			return 'added';
		}
		return 'User exsist already'
	} catch { console.log('problem') }
}
