const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const AirlineDAO = require('../daos/airlines');
const isLoggedIn = require('../middleware/logged_in')
const isAdmin = require('../middleware/authorization')

// create
router.post("/",isLoggedIn,isAdmin, async (req, res, next) => {
    console.log('airline_obj in airline',req.body)
    const airlineobj = req.body;
    console.log('airline_obj in airline',airlineobj)
    if ( !airlineobj|| JSON.stringify(airlineobj) === '{}'|| !airlineobj.name || !airlineobj.code) {
        res.status(400).send('is required');
    } else {
        try {
            const airlineresult = await AirlineDAO.createAirlinesrec(airlineobj);
            res.json(airlineresult)
        } catch (error) {
            if (error instanceof AirlineDAO.BadDataError) {
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
    try {
        const airlineresults = await AirlineDAO.getAirlines()
        return res.status(200).json(airlineresults);
    } catch(e) {
        next(e)
    }

});
 
//get by Id

router.get("/:id", async (req, res, next) => {
    const airlineid = req.params.id
    try {
        const airlineresult = await  AirlineDAO.getAirlinesById(airlineid);
        console.log("airline result in dao", airlineresult)
        if(airlineresult){
           res.json(airlineresult)
            
        }else{
            
             res.status(404).send("No Matching Id")
        }
        
        
    } catch(error) {
        if (error instanceof AirlineDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            console.log("error in get by id", error)
            next(error);
        }
    }
});

router.put("/",isLoggedIn,isAdmin,async (req, res, next) => {
    const airlineupdrec = req.body
    try {
        const airlineresultsupd = await AirlineDAO.updateAirlines(airlineupdrec)
        return res.status(200).json(airlineresultsupd);
    } catch(e) {
        next(e)
    }

});

  module.exports = router;