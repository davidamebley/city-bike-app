import csv from 'csv-parser';
import fs from 'fs';
import readline from 'readline';
import { MongoClient } from 'mongodb';

interface Journey {
    departure: string;
    return: string;
    departure_station_id: string;
    departure_station_name: string;
    return_station_id: string;
    return_station_name: string;
    covered_distance: number;
    duration: number;
}

type JourneyRow = {
    'Departure': string,
    'Return': string,
    'Departure station id': string,
    'Departure station name': string,
    'Return station id': string,
    'Return station name': string,
    'Covered distance (m)': string,
    'Duration (sec.)': string
}

interface Station {
    _id: string;
    name: string;
    address: string;
    x: number;
    y: number;
}

type StationRow = {
    'ID': string,
    'Name': string,
    'Osoite':string,
    'x':string,
    'y':string
}

export async function importJourneys(csvFiles: string[]) {
  for (let index = 0; index < csvFiles.length; index++) {
    try {
        // Connect to MongoDB Atlas
        const uri = process.env.MONGO_DB!;
        const client = new MongoClient(uri);
        await client.connect();
    
        // Get a reference to the "journeys" collection in the "helsinki-city-bike-db" database
        const db = client.db('helsinki-city-bike-db');
        const collection = db.collection<Journey>('journeys');
    
        const batchSize = 1000;
        let counter = 0;
        let bulkOperation = collection.initializeOrderedBulkOp();
    
        // Define the executeBatchAndReset function here
        async function executeBatchAndReset() {
          // Execute bulk write operation
          await bulkOperation.execute();
    
          // New bulk operation object created for the next batch.
          bulkOperation = collection.initializeOrderedBulkOp();
        }
    
        // Create a read stream and a readline interface
        const readStream = fs.createReadStream(csvFiles[index]);
        const readLine = readline.createInterface({
          input: readStream,
          crlfDelay: Infinity,
        });
    
        let isFirstLine = true;
        const headers = ['Departure', 'Return', 'Departure station id', 'Departure station name', 'Return station id', 'Return station name', 'Covered distance (m)', 'Duration (sec.)'];
    
        console.log(`Importing data to DB. Please Wait...`)
        // Read and process the CSV file line by line
        for await (const line of readLine) {
          if (isFirstLine) {
            isFirstLine = false;
            continue; // Skip the header line
          }
    
          const row: JourneyRow = await new Promise((resolve, reject) => {
            csv({ headers: headers })
              .on('data', (data) => resolve(data))
              .on('error', (err) => reject(err))
              .end(line);
          });
    
          const duration = parseInt(row['Duration (sec.)'], 10);
          const distance = parseInt(row['Covered distance (m)'], 10);
    
          // Validate journey data
          if (duration >= 10 && distance >= 10) {
            const journey: Journey = {
              departure: row['Departure'],
              return: row['Return'],
              departure_station_id: row['Departure station id'],
              departure_station_name: row['Departure station name'],
              return_station_id: row['Return station id'],
              return_station_name: row['Return station name'],
              covered_distance: distance,
              duration: duration,
            };
    
            counter++;
            // Add insert operation to bulk write object
            bulkOperation.insert(journey);
    
            // Execute the batch if batchsize reached
            if (counter % batchSize === 0) {
              await executeBatchAndReset();
            }
          }
        }
    
        // Execute the remaining bulk write operations and close the database connection
        if (counter % batchSize !== 0) {
          await executeBatchAndReset();
        }
        console.log(`Import completed for ${csvFiles[index]}`);
        await client.close();
    
      } catch (err) {
        console.error(err);
      }
  }
}

export async function importStations(csvFile: string) {
    try {
        // Connect to MongoDB Atlas
        const uri = process.env.MONGO_DB!;
        const client = new MongoClient(uri);
        await client.connect();
    
        // Get a reference to the "journeys" collection in the "helsinki-city-bike-db" database
        const db = client.db('helsinki-city-bike-db');
        const collection = db.collection<Station>('stations');
    
        const batchSize = 1000;
        let counter = 0;
        let bulkOperation = collection.initializeOrderedBulkOp();
    
        // Define the executeBatchAndReset function here
        async function executeBatchAndReset() {
          // Execute bulk write operation
          await bulkOperation.execute();
    
          // New bulk operation object created for the next batch.
          bulkOperation = collection.initializeOrderedBulkOp();
        }
    
        // Create a read stream and a readline interface
        const readStream = fs.createReadStream(csvFile);
        const readLine = readline.createInterface({
          input: readStream,
          crlfDelay: Infinity,
        });
    
        let isFirstLine = true;
    
        console.log(`Importing data to DB. Please Wait...`)
        // Read and process the CSV file line by line
        let headers = ['ID', 'Name', 'Osoite', 'x', 'y']; // Initialize headers array with expected case
        for await (const line of readLine) {
            if (isFirstLine) {
                headers = line.split(','); // Set headers to the values from the first line of the CSV file
                isFirstLine = false;
                continue; // Skip the header line
            }
            
            const row: StationRow = await new Promise((resolve, reject) => {
            csv({ headers: headers })
              .on('data', (data) => resolve(data))
              .on('error', (err) => reject(err))
              .end(line);
            });

          const x_coord = parseFloat(row['x']);
          const y_coord = parseFloat(row['y']);

          console.log(`row=> ${JSON.stringify(row)}`)
            const station: Station = {
              _id: row['ID'],
              name: row['Name'],
              address: row['Osoite'],
              x: x_coord,
              y: y_coord,
            };
    
            counter++;
            // Add insert operation to bulk write object
            bulkOperation.insert(station);
    
            // Execute the batch if batchsize reached
            if (counter % batchSize === 0) {
              await executeBatchAndReset();
            }
        }
    
        // Execute the remaining bulk write operations and close the database connection
        if (counter % batchSize !== 0) {
          await executeBatchAndReset();
        }
        console.log(`Import completed for ${csvFile}`);
        await client.close();
    
      } catch (err) {
        console.error(err);
      }
}