import mongoose from 'mongoose';

import getMongoConnectionString from './retrieveDbSecret';

export const connectDB = async () => {
    try {
        const MONGO_URI = await getMongoConnectionString();

        const dbConnect = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000
        });
        console.log(`MongoDB Connected: ${dbConnect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}