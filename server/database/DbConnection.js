import mongoose from "mongoose";

export function DbConnection() {

mongoose.connect(  process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then("database connected")
.catch({error: err => console.log('Failed to connect to database mongodb',err)})
}