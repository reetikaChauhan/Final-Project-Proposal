const { Router } = require("express");
const router = Router();


router.use("/auth", require('./auth'));
router.use("/airports", require('./airports'));
router.use("/airlines", require('./airlines'));
router.use("/flights", require('./flights'));
router.use("/bookings", require('./booking'));


router.use((err,req,res,next) => {
    if(err.message.includes("Cast to ObjectId failed")){
        return res.status(400).send("Invalid id provided")
    } else{
        res.status(500).send("Something broke!")
    }
});
module.exports = router;