import mongoose from 'mongoose';

import getMongoConnectionString from './retrieveDbSecret';

export const connectDB = async () => {
    try {
        const MONGO_URI = await getMongoConnectionString();

        console.log(`MONGO_URI_: ${MONGO_URI}`)

        const dbConnect = await mongoose.connect(MONGO_URI, 
            {
                serverSelectionTimeoutMS: 150000
            });
        console.log(`MongoDB Connected: ${dbConnect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}