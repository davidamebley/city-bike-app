require('dotenv').config()
const express = require('express');
const cors = require ('cors');
const path = require ('path');

const { connectDB } = require ('./config/db');
const journeyRoutes = require ('./routes/journeyRoutes');
const stationRoutes = require ('./routes/stationRoutes');

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
// Enable CORS for your server
app.use((req:any, res:any, next:any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});  

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/journeys', journeyRoutes);
app.use('/api/stations', stationRoutes);

// ------ Serve Our Frontend for Deployment
if (process.env.NODE_ENV === 'production') {
    // Setting our build folder for the static assets/files in our react frontend
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Load the index html file that is in our static build folder when all other routes callded
    app.get('*', (req:any, res:any) =>
        res.sendFile(
            path.resolve(__dirname, '../frontend', 'build', 'index.html')
        )
    );
}else{
    app.get('/', (req:any, res:any) => res.send('Please set to a production environment first'));
}
// ------ End of Serve Our Frontend for Deployment

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})