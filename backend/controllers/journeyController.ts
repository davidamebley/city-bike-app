import Journey from "../models/journey";

// @desc Get Journeys
// @route GET /api/journeys
// @access Public
export const getJourneys = async (req: any, res: any) => {
    const journeys = await Journey.find();

    res.status(200).json(journeys);
}