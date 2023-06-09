# Helsinki City Bikes Application

The Helsinki City Bikes Application is a full-stack web application that allows users to explore bike stations and journey data in Helsinki. It provides information about bike stations, such as their names, addresses, and the number of journeys starting and ending at each station. Users can also view details about individual stations and visualize their locations on a map.

The application consists of two main components: a backend server built with Node.js and Express.js for handling data and serving API endpoints, and a frontend client built with React.js for the user interface. The backend server handles data retrieval from a MongoDB database and provides RESTful API endpoints to fetch journey and station data. The frontend user interface allows users to interact with the data and view it in a user-friendly manner.

## Live Demo

A live demo of the Helsinki City Bikes Application is available [here](https://helsinki-city-bikes-app.herokuapp.com/).

## Project Structure

The project follows a directory structure that separates the backend and frontend components. Here's an overview of the key files and directories:

```
├── backend
│   ├── config
│   │   ├── db.ts
│   │   └── retrieveDbSecret.ts
│   ├── controllers
│   │   ├── journeyController.ts
│   │   └── stationController.ts
│   ├── helpers
│   │   └── importCSV.ts
│   ├── jobs
│   │   └── updateJourneyCount.ts
│   ├── models
│   │   ├── counter.ts
│   │   ├── journey.ts
│   │   └── station.ts
│   ├── routes
│   │   ├── journeyRoutes.ts
│   │   └── stationRoutes.ts
│   └── server.ts
├── frontend
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── components
│   │   │   ├── AddStationDialog.tsx
│   │   │   ├── JourneyList.tsx
│   │   │   ├── MapModal.tsx
│   │   │   ├── SingleStationView.tsx
│   │   │   ├── StationList.tsx
│   │   │   └── StationMap.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── styles
│   │   │   ├── journeyList.css
│   │   │   ├── mapModal.css
│   │   │   ├── singleStationView.css
│   │   │   ├── stationList.css
│   │   │   └── stationMap.css
├── README.md
├── docker-compose.yml
└── package.json
```
## Features

- View a list of bike stations in Helsinki
- Search for stations by name or address
- View detailed information about individual stations, including the number of journeys starting and ending at each station and the average distances of journeys
- See the top 5 most popular return stations for journeys starting from a specific station
- See the top 5 most popular departure stations for journeys ending at a specific station
- View the location of a station on a map
- Add new stations to the system


- **backend**: Contains the backend server code.
  - **config**: Includes configuration files related to the database and retrieving sensitive information.
  - **controllers**: Contains the controllers responsible for handling API requests and responses.
  - **helpers**: Includes helper functions, such as importing CSV data into the database.
  - **jobs**: Contains background jobs, such as updating journey counts.
  - **models**: Includes the data models used for storing journey and station information in the database.
  - **routes**: Defines the API routes for journeys and stations.
  - **server.ts**: The entry point of the backend server.

## Prerequisites

Before running the Helsinki City Bikes Application locally, ensure that you have the following prerequisites installed:

- Node.js
- NPM
- MongoDB


## Getting Started

- To run the Helsinki City Bikes App locally, follow these steps:

   1. Clone the repository: `git clone https://github.com/davidamebley/city-bike-app.git`
   2. Navigate to the project root directory: `cd helsinki-city-bikes-app`
   3. Install the dependencies:
      - Backend: `npm install`
      - Frontend: `cd frontend && npm install`
   4. Configure the environment variables:
      - Backend: Create a `.env` file in the project root and set the following variables:
        - AWS_REGION=<your-aws-region>
        - AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
        - AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
        - MONGO_URI=<your-mongodb-uri>
        - PORT=<backend-server-port>
        - REACT_APP_SERVER_URL=<backend-server-url>
      - Frontend: Create a `.env` file in the `frontend` directory and set the following variable:
        - REACT_APP_SERVER_URL=<backend-server-url>
   5. Import the data into the database:
      - In the `backend/server.ts` file, call the `importJourneys()` and `importStations()` functions from `importCSV.ts`.
   6. Start the application:
      - Backend: In the project root, run `npm run server`
      - Frontend: `cd frontend && npm start`
   7. Access the application in your browser at `http://localhost:<frontend-port>`

- To run the Helsinki City Bikes App using Docker, follow these steps:

   1. Make sure you have Docker installed on your machine.
   2. Open a terminal and navigate to the project root directory where the `Dockerfile` and `docker-compose.yml` files are located.
   3. Build the Docker images and start the containers by running the following command:

      ```
      docker-compose up --build
      ```

      This command will build the frontend and backend images, create a container based on these images, and start the application.

   4. Wait for the build process to complete. Once finished, you should see output in the terminal indicating that the app is running.

   5. Access the application in your browser at `http://localhost:5000`.

      The app will be served by the Docker container running on port 5000.

By using Docker and the provided `Dockerfile` and `docker-compose.yml` files, the application's dependencies, configurations, and runtime environment are containerized and isolated. This allows for easier deployment and ensures consistency across different environments.

Note: Before running the Docker containers, make sure to configure the necessary environment variables in the `docker-compose.yml` file. Replace the `${AWS_ACCESS_KEY_ID}`, `${AWS_SECRET_ACCESS_KEY}`, `${AWS_REGION}`, and `${REACT_APP_SERVER_URL}` placeholders with your actual values.

If you encounter any issues or need further assistance, please let us know.
## Importing Dataset

To import the journey and station datasets into the database, follow these steps:

1. Download the journey datasets from the following links:
   - [2021-05.csv](https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv)
   - [2021-06.csv](https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv)
   - [2021-07.csv](https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv)
2. Download the station dataset from the following link:
   - [HSL City Bicycle Stations Dataset](https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv)
3. Place the journey datasets in the `backend/data` directory.
4. Place the station dataset in the `backend/data` directory.
5. In the `backend/server.ts` file, call the `importJourneys()` and `importStations()` functions from `importCSV.ts`.
6. Run the server to import the datasets into the database.

## Tests
To run the tests for the Helsinki City Bikes App, you can use the following commands:

1. Unit Tests with Jest:
   - Run the unit tests with the following command:
     ```
     npm test
     ```
   This command will execute the unit tests using Jest and provide the test results in the console.

2. End-to-End Tests with Cypress:
   - To run the Cypress tests in headless mode, use the command:
     ```
     npm run test:cypress
     ```
   This command will execute the Cypress tests in the command-line interface and provide the test results.

   - To open the Cypress Test Runner for interactive test execution and debugging, use the command:
     ```
     npm run cypress:open
     ```
   This command will open the Cypress Test Runner window, allowing you to select and run individual tests or the entire test suite.

Please ensure that you have the necessary dependencies installed and the required environment set up before running the tests.

If you encounter any issues while running the tests or need further assistance, please let us know.

## Background Job and Caching

To optimize the performance of the application, a background job is used to count the total number of documents in the journeys collection. This choice was made because the collection contains over 3 million records, and retrieving the total count for pagination purposes directly from the database could be resource-intensive. The background job periodically updates the total count and stores it in the Counter schema. 

In addition, the application utilizes nodecache for in-memory caching to store frequently requested data, such as the total count, reducing the load on the database. This helps improve the overall responsiveness and efficiency of the application.

**Trade-offs:**
Delayed data freshness (in terms of calculating the journey count and storing the result in a separate schema), and additional complexity are among the key trade-offs of this strategy. However, in the context of this application, these are unlikely to significantly impact the user experience as they provide substantial benefits in terms of improved performance for reading the total count of journeys.

Please note that other alternatives, such as using Redis or implementing database partitioning, could be considered for handling large datasets in production environments. However, for the purpose of this project, the chosen approach of utilizing a background job, together with nodecache and the Counter schema, provides a suitable solution.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions to the Helsinki City Bikes Application are always welcome. If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## Acknowledgements

The Helsinki City Bikes Application uses the following open-source libraries:

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Leaflet](https://leafletjs.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)

---

This README.md document provides an overview of the Helsinki City Bikes Application and outlines the steps to set up the application locally or in a production environment. It also includes information about contributing, licensing, and acknowledgments.

For detailed code documentation and explanations, please refer to the comments in the actual source code files.

If you have any further questions or need additional assistance, please feel free to reach out. Enjoy exploring the Helsinki City Bikes Application!

---

**Note:** For security reasons, make sure to keep the `.env` files confidential and do not include them in version control.