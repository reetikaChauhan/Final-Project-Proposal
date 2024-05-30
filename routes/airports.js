const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const AirportDAO = require('../daos/airports');
const isLoggedIn = require('../middleware/logged_in')
const isAdmin = require('../middleware/authorization')

// create
router.post("/",isLoggedIn,isAdmin, async (req, res, next) => {
    const airportobj = req.body;
    if ( !airportobj|| JSON.stringify(airportobj) === '{}'|| !airportobj.name || !airportobj.code) {
        res.status(400).send('is required');
    }
   else {
        try {
            const airportresult = await AirportDAO.createAirportrec(airportobj);
            res.json(airportresult)
        } catch (error) {
            if (error instanceof AirportDAO.BadDataError) {
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

// GET
router.get("/", async (req, res, next) => {
    if(!req.query.location){
        try {
            const airportresults = await AirportDAO.getAirport()
            return res.status(200).json(airportresults);
        } catch(e) {
            next(e)
        }

    }else{
        
        try {
            const airportresults = await AirportDAO.getAirportByCity(req.query.location)
            console.log("in airport routes", airportresults)
            return res.status(200).json(airportresults);
        } catch(e) {
            next(e)
        }
    }
});
//get by Id
router.get("/:id", async (req, res, next) => {
    const airportid = req.params.id
    console.log('airport in get by id', airportid)
    const airportresult = await  AirportDAO.getAirportById(airportid);
    if (airportresult) {
        res.json(airportresult);
      } else {
        res.sendStatus(404);
      }
});

router.put("/:id",isLoggedIn,isAdmin, async (req, res, next) => {
    const airportupdrec = req.body
    const aid = req.params.id
    try {
        const airportresultsupd = await AirportDAO.updateAirport(aid,airportupdrec)
        return res.status(200).json(airportresultsupd);
    } catch(e) {
        next(e)
    }
});

  module.exports = router;