require('dotenv').config()
import express from 'express';
import cors from 'cors';
import path from 'path';

import { connectDB } from './config/db'
import journeyRoutes from './routes/journeyRoutes';
import stationRoutes from './routes/stationRoutes';
import { importJourneys } from './helpers/importCSV';

// Connect to MongoDB
connectDB();

// Initially Import Journeys from CSV to DB.
const csvFiles = [path.join(__dirname, '../../2021-05.csv'), path.join(__dirname, '../../2021-06.csv'), path.join(__dirname, '../../2021-07.csv')];
// importJourneys(csvFiles);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/journeys', journeyRoutes);
app.use('/api/stations', stationRoutes);

// ------ Serve Our Frontend for Deployment
if (process.env.NODE_ENV === 'production') {
    // Setting our build folder for the static assets/files in our react frontend
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Load the index html file that is in our static build folder when all other routes callded
    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'build', 'index.html')
        )
    );
}else{
    app.get('/', (req, res) => res.send('Please set to a production environment first'));
}
// ------ End of Serve Our Frontend for Deployment

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})