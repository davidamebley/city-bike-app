import Journey from "../models/journey";
import Station from "../models/station";

// @desc Get Stations
// @route GET /api/stations
// @access Public
export const getStations = async (req: any, res: any) => {
    const stations = await Station.find();
    res.status(200).json(stations);
}

// @desc Get Station
// @route GET /api/stations
// @access Public
export const getStation = async (req: any, res: any) => {
    const station = await Station.findById(req.params.id);
    const journeysStarting = await Journey.countDocuments({ departureStationId: station?.id });
    const journeysEnding = await Journey.countDocuments({ returnStationId: station?.id });

    res.status(200).json({
    station,
    journeysStarting,
    journeysEnding,
  });
}