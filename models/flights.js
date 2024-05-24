const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    departure_airport_id: {  type: mongoose.Schema.Types.ObjectId,
        ref: "airport", },
    arrival_airport_id: {  type: mongoose.Schema.Types.ObjectId,
        ref: "airport", },
    departure_time: { type: String, index: true,required: true },
    departure_date: { type: String, index: true,required: true },
    arrival_date:{ type: String, index: true,required: true },
    arrival_time: { type: String, index: true,required: true },
    airline_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "airline",
    } ,
    seat_map:{
        type: [{
            // Define the structure of each object in the array
            seat_num: {type:String},
            booked: {type: Boolean, default: false}
            // Add more fields s needed
          }]
    }
});


module.exports = mongoose.model("flights",  flightSchema);