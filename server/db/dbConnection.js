import mongoose from 'mongoose'

const dbConnection = async() => {
    try {
    await mongoose.connect(`${process.env.MONGO_URL}`,{dbName:"Learnify"})
        console.log("Database connected successfully!");
    } catch (error) {
        console.log(`Error from db connection file : ${error}`);
    }
}

export default dbConnection