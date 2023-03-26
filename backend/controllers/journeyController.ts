import Journey from "../models/journey";

// @desc Get Journeys
// @route GET /api/journeys
// @access Public
export const getJourneys = async (req: any, res: any) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;    // Specifies the number of documents to skip

    try {
        const journeys = await Journey.find().skip(skip).limit(limit);
        const totalCount = await Journey.countDocuments();

        res.status(200).json({
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            journeys
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching journeys.' });
    }
}