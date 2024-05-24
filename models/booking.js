const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    passenger_id: { type: mongoose.Schema.Types.ObjectId,
        ref: "passenger" },
    flight_id: { type: mongoose.Schema.Types.ObjectId,
        ref: "flights",},
    status: { type: String, required: true },
    seat: { type: String, required: true }
});


module.exports = mongoose.model("booking", bookingSchema);