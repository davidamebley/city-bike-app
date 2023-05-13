import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const dbConnect = await mongoose.connect(process.env.MONGO_DB!, {
            serverSelectionTimeoutMS: 30000
        });
        console.log(`MongoDB Connected: ${dbConnect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}