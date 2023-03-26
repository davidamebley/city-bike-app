import Journey from "../models/journey";
import Station from "../models/station";

// @desc Get Stations
// @route GET /api/stations
// @access Public
export const getStations = async (req: any, res: any) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    // Specifies the number of documents to skip

    try {
      const stations = await Station.find().skip(skip).limit(limit);
      const totalCount = await Station.countDocuments();

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