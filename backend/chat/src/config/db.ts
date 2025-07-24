import mongoose from "mongoose";
import { MONGO_URL } from "./constants.js";

const connectDb = async () => {
    const url = MONGO_URL;
    if(!url){
        throw new Error("Mongo url not provided on .env")
    }

    try {
        await mongoose.connect(url, {
            dbName :  "chatar_patar_microservices_app"
        });
        console.log('Application connected to mongodb')
    } catch (error) {
        console.error("failed to connect", error)
        process.exit(1)
    }
}

export default connectDb;