import { Request, Response } from 'express';
import NodeCache from 'node-cache';

import Journey from "../models/journey";

const cache = new NodeCache();

// Parse and return query params
const parseQueryParams = (req: Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search as string || '';
  const sortBy = req.query.sortBy as string || 'departure_station_name';
  const sortOrder = req.query.sortOrder || 'asc';
  const minDistance = parseFloat(req.query.minDistance as string) * 1000 || 0;
  const maxDistance = parseFloat(req.query.maxDistance as string) * 1000 || Infinity;
  const minDuration = parseFloat(req.query.minDuration as string) * 60 || 0;
  const maxDuration = parseFloat(req.query.maxDuration as string) * 60 || Infinity;

  return { page, limit, skip, search, sortBy, sortOrder, minDistance, maxDistance, minDuration, maxDuration };
};

const validateRequiredFields = (fields: any): boolean => {
  const requiredFields = ['departure', 'return', 'departure_station_id', 'departure_station_name', 'return_station_id', 'return_station_name', 'covered_distance', 'duration'];
  return requiredFields.every(field => fields[field]);
};

// @desc Get Journeys
// @route GET /api/journeys
// @access Public
export const getJourneys = async (req: Request, res: Response) => {
    const { page, limit, skip, search, sortBy, sortOrder, minDistance, maxDistance, minDuration, maxDuration } = parseQueryParams(req);

    // Filtering
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

        // Generate cache key
        const cacheKey = `journeys:${search || 'all'}:${minDistance}:${maxDistance}:${minDuration}:${maxDuration}`;

        // Check if totalCount is in cache
        let totalCount: number | undefined;

        totalCount = cache.get(cacheKey);
      
        // If totalCount is not in cache, fetch from database and set cache
        if (totalCount === undefined) {
          totalCount = await Journey.countDocuments(query);
          cache.set(cacheKey, totalCount);
        }
      
        res.status(200).json({
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          journeys,
        });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching journeys.' });
      }
      
}

// @desc Add a new Journey
// @route POST /api/journeys
// @access Public
export const addJourney = async (req: Request, res: Response) => {
    const { departure, return: returnDate, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration } = req.body;

    if (!validateRequiredFields(req.body)) {
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