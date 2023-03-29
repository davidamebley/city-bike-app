import NodeCache from 'node-cache';

import Journey from "../models/journey";
import Station from "../models/station";

const cache = new NodeCache();

// @desc Get Stations
// @route GET /api/stations
// @access Public
export const getStations = async (req: any, res: any) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    // Specifies the number of documents to skip
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
      const stations = await Station.find(searchQuery).skip(skip).limit(limit).lean();
      // lean returns plain JavaScript objects instead of Mongoose documents, which can be faster to work with
    
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
// @route GET /api/stations
// @access Public
export const getStation = async (req: any, res: any) => {
    const station = await Station.findById(req.params.id);
    const journeysStarting = await Journey.countDocuments({ departure_station_id: station?.id });
    const journeysEnding = await Journey.countDocuments({ return_station_id: station?.id });

    res.status(200).json({
    station,
    journeysStarting,
    journeysEnding,
  });
}