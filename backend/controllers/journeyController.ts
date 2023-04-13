import NodeCache from 'node-cache';

import Journey from "../models/journey";

const cache = new NodeCache();

// @desc Get Journeys
// @route GET /api/journeys
// @access Public
export const getJourneys = async (req: any, res: any) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    // Specifies the number of documents to skip
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'departure_station_name';
    const sortOrder = req.query.sortOrder;

    // Filtering
    const minDistance = parseFloat(req.query.minDistance) * 1000 || 0;
    const maxDistance = parseFloat(req.query.maxDistance) * 1000 || Infinity;
    const minDuration = parseFloat(req.query.minDuration) * 60 || 0;
    const maxDuration = parseFloat(req.query.maxDuration) * 60 || Infinity;

    const filterQuery = {
        $and: [
          {
            covered_distance: {
              $gte: minDistance,
              $lte: maxDistance,
            },
          },
          {
            duration: {
              $gte: minDuration,
              $lte: maxDuration,
            },
          },
        ],
      };

    const searchQuery = search
    ? {
        $or: [
          {
            departure_station_name: {
              $regex: new RegExp(search, 'i'),
            },
          },
          {
            return_station_name: {
              $regex: new RegExp(search, 'i'),
            },
          },
        ],
      }
    : {};

    const query = search ? { $and: [searchQuery, filterQuery] } : filterQuery;
      
    try {
        const journeys = await Journey.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .lean();
        // lean returns plain JavaScript objects instead of Mongoose documents, which can be faster to work with
        
        // Get maximum duration from cache
        let maxDuration = cache.get('maxDuration');
        // Get maximum distance from cache
        let maxDistance = cache.get('maxDistance');

        // If maxDuration is not in cache, fetch from database and set cache
        if (maxDuration === undefined) {
            const maxDurationResult = await Journey.aggregate([
              { $match: filterQuery },
              { $group: { _id: null, maxDuration: { $max: "$duration" } } },
            ]);
  
            maxDuration = maxDurationResult.length > 0 ? maxDurationResult[0].maxDuration / 60 : 0;
            cache.set('maxDuration', maxDuration);
        }

        // If maxDistance is not in cache, fetch from database and set cache
        if (maxDistance === undefined) {
            const maxDistanceResult = await Journey.aggregate([
              { $match: filterQuery },
              { $group: { _id: null, maxDistance: { $max: "$covered_distance" } } },
            ]);
  
            maxDistance = maxDistanceResult.length > 0 ? maxDistanceResult[0].maxDistance / 1000 : 0;
            cache.set('maxDistance', maxDistance);
        }

        // Check if totalCount is in cache
        let totalCount: number | undefined;
      
        // Search
        if (search) {
          totalCount = await Journey.countDocuments(searchQuery);
        } else {
          totalCount = cache.get('totalCount');
          
          // If totalCount is not in cache, fetch from database and set cache
          if (totalCount === undefined) {
            totalCount = await Journey.countDocuments();
            cache.set('totalCount', totalCount);
          }
        }
      
        res.status(200).json({
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          journeys,
          maxDuration,
          maxDistance
        });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching journeys.' });
      }
      
}

// @desc Add a new Journey
// @route POST /api/journeys
// @access Public
export const addJourney = async (req: any, res: any) => {
    const { departure, return: returnDate, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration } = req.body;
  
    if (!departure || !returnDate || !departure_station_id || !departure_station_name || !return_station_id || !return_station_name || !covered_distance || !duration) {
        res.status(400).json({ error: 'Please provide all required fields' });
        return;
    }
  
    try {
        const newJourney = new Journey({ 
            departure, 
            return: returnDate, 
            departure_station_id, 
            departure_station_name, 
            return_station_id, 
            return_station_name, 
            covered_distance, 
            duration 
        });
        await newJourney.save();
        res.status(201).json(newJourney);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding a new journey.' });
    }
  };
  