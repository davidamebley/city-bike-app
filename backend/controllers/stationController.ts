const NodeCache = require('node-cache');

const Journey = require("../models/journey");
const Station = require("../models/station");

const cache = new NodeCache();

// @desc Get Stations
// @route GET /api/stations
// @access Public
export const getStations = async (req: any, res: any) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const searchQuery = search
    ? {
        $or: [
          {
            name: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            address: {
              $regex: new RegExp(search, 'i'),
            },
          },
        ],
      }
    : {};

    try {
      const stations = await Station.find(searchQuery)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    
      // Check if totalCount is in cache
      let totalCount: number | undefined;
    
      // Search
      if (search) {
        totalCount = await Station.countDocuments(searchQuery);
      } else {
        totalCount = cache.get('totalCount');
        
        // If totalCount is not in cache, fetch from database and set cache
        if (totalCount === undefined) {
          totalCount = await Station.countDocuments();
          cache.set('totalCount', totalCount);
        }
      }
    
      res.status(200).json({
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        stations
      });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching stations.' });
    }
    
}

// @desc Get Station
// @route GET /api/stations/:id
// @access Public
export const getStation = async (req: any, res: any) => {
  const stationId = req.params.id;

  // Check if the station is in the cache
  const cachedStation = cache.get(`station-${stationId}`);

  if (cachedStation) {
    // Return the cached station if it exists
    res.status(200).json(cachedStation);
  } else {
    const station = await Station.findById(stationId);
    const journeysStarting = await Journey.countDocuments({ departure_station_id: stationId });
    const journeysEnding = await Journey.countDocuments({ return_station_id: stationId });

    // Calculate average distances
    const averageStartingDistance = await Journey.aggregate([
        { $match: { departure_station_id: stationId } },
        { $group: { _id: null, avgDistance: { $avg: '$covered_distance' } } },
    ]);

    const averageEndingDistance = await Journey.aggregate([
        { $match: { return_station_id: stationId } },
        { $group: { _id: null, avgDistance: { $avg: '$covered_distance' } } },
    ]);

    // Calculate top 5 popular return stations
    const popularReturnStations = await Journey.aggregate([
      { $match: { departure_station_id: stationId } },
      { $group: { _id: '$return_station_id', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'stations',
          localField: '_id',
          foreignField: '_id',
          as: 'station',
        },
      },
      { $unwind: '$station' },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Calculate top 5 popular departure stations
    const popularDepartureStations = await Journey.aggregate([
      { $match: { return_station_id: stationId } },
      { $group: { _id: '$departure_station_id', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'stations',
          localField: '_id',
          foreignField: '_id',
          as: 'station',
        },
      },
      { $unwind: '$station' },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const result = {
      station,
      journeysStarting,
      journeysEnding,
      averageStartingDistance: averageStartingDistance[0]?.avgDistance || 0,
      averageEndingDistance: averageEndingDistance[0]?.avgDistance || 0,
      popularReturnStations,
      popularDepartureStations,
    };

    // Cache the result with a unique key and set an optional TTL (in seconds)
    cache.set(`station-${stationId}`, result, 3600);

    res.status(200).json(result);
  }
};

// @desc Add a new Station
// @route POST /api/stations
// @access Public
export const addStation = async (req: any, res: any) => {
  const { name, address, x, y } = req.body;

  if (!name || !address || !x || !y) {
    res.status(400).json({ error: 'Please provide all required fields: name, address, x, and y, and in the right format.' });
    return;
  }

  try {
    // Find the current maximum _id value in the collection
    const maxIdDoc = await Station.findOne({}).sort({_id: -1});

    // Calculate the new _id value by incrementing the max _id by 1
    const newId = maxIdDoc ? parseInt(maxIdDoc._id) + 1 : 1;

    // Create a new Station document with the new _id value
    const newStation = new Station({ _id: newId.toString(), name, address, x, y });

    await newStation.save();
    res.status(201).json(newStation);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding a new station.' });
  }
};
