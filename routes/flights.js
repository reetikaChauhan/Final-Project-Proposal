const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const FlightDAO = require('../daos/flights');
const AirportDAO = require('../daos/airports');
const isLoggedIn = require('../middleware/logged_in')
const isAdmin = require('../middleware/authorization')

// create
router.post("/",isLoggedIn,isAdmin, async (req, res, next) => {
    const flightobj = req.body;
    if ( JSON.stringify(flightobj) === '{}') {
        res.status(400).send('is required');
    } else {
        try {
            const flightresult = await FlightDAO.createFlightrec(flightobj);
            res.json(flightresult)
        } catch (error) {
            if (error instanceof FlightDAO.BadDataError) {
                // Handle specific error types
                return res.status(409).send(error.message); // 409 for duplicate key error
            } else {
                // Handle other errors
                next(error);
            }
            next(error);
        }
    }
});

// search flights by departure city and arrival city in query parameters
router.get("/search", async (req, res, next) => {
    const {departure_city, arrival_city} = req.query
        try {
            const departure_city_objs = await AirportDAO.getAirportByCity(departure_city)
            const departureAirportIds = departure_city_objs.map(airport => airport._id);
            const arrival_city_objs = await AirportDAO.getAirportByCity( arrival_city)
            const arrivalAirportIds =  arrival_city_objs.map(airport => airport._id);

            const flightresults = await FlightDAO.getFlightsByAirportName(departureAirportIds, arrivalAirportIds )
            return res.status(200).json(flightresults);
        } catch(e) {
            next(e)
        }
});
router.get("/",async (req, res, next) => {
        try {
            const flightresults = await FlightDAO.getFlights()
            return res.status(200).json(flightresults);
        } catch(e) {
            next(e)
        }
    
});


//get by Id

router.get("/:id", async (req, res, next) => {
    const flightid = req.params.id
    try {
        const flightresult = await  FlightDAO.getFlightsById(flightid);
        return res.status(200).json(flightresult);
    } catch(error) {
        if (error instanceof FlightDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});





  module.exports = router;