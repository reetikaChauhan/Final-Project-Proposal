const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const PassengerDAO = require('../daos/passenger');
const isLoggedIn = require('../middleware/logged_in')


// create
router.post("/", async (req, res, next) => {
    const userinfo = req.body;
    const userrec = req.user
    if ( JSON.stringify(flightobj) === '{}') {
        res.status(400).send('is required');
    } else {
        try {
            const passengerresult = await PassengerDAO.passengerrec(userrec,userinfo);
            res.json(passengerresult)
        } catch (error) {
            if (error instanceof PassengerDAO.BadDataError) {
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
        const passengerresults = await PassengerDAO.getPassengers()
        return res.status(200).json(passengerresults);
    } catch(e) {
        next(e)
    }

});

//get by Id

router.get("/:id", async (req, res, next) => {
    const passengerid = req.params.id
    try {
        const passengerresult = await  PassengerDAO.getPassengersById(passengerid);
        return res.status(200).json(passengerresult);
    } catch(error) {
        if (error instanceof PassengerDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});


  module.exports = router;