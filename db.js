const mongoose= require("mongoose");
require("dotenv").config()
const db= process.env.mongoURI

const connectDB = async ()=> {
    try{
  await mongoose.connect(db,{
    useNewUrlParser: true
   });
  console.log("MongoDB connected")
    } catch(err){
      console.log(err.message);
      process.exit(1);
    }
}

module.exports = connectDB