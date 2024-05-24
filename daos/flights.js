const Flights = require('../models/flights');
const mongoose = require('mongoose');

module.exports = {};

module.exports.getFlights = async() => {
  const flights =  await Flights.find().lean();
  return flights
}


module.exports.getFlightsById = async (flightId) => {
    const flight =  await Flights.find({ _id: flightId }).lean();
    return flight
}


module.exports.getFlightsByAirportName = async(departureAirportIds,arrivalAirportIds ) => {
  try {
   
    if (!departureAirportIds || !arrivalAirportIds) {
        console.log('One or both of the cities do not have corresponding airport IDs.');
        return;
    }

    // Step 2: Perform the Aggregation
    const result = await Flights.aggregate([
        {
            $match: {
              departure_airport_id: { $in: departureAirportIds },
              arrival_airport_id: { $in: arrivalAirportIds },
            },
        },
        {
            $lookup: {
                from: 'airports',
                localField: 'departure_airport_id',
                foreignField: '_id',
                as: 'departure_airport',
            },
        },
        {
            $lookup: {
                from: 'airports',
                localField: 'arrival_airport_id',
                foreignField: '_id',
                as: 'arrival_airport',
            },
        },
        {
            $unwind: '$departure_airport',
        },
        {
            $unwind: '$arrival_airport',
        },
        {
            $project: {
                _id: 1,
                departure_airport_name: '$departure_airport.name',
                arrival_airport_name: '$arrival_airport.name',
                departure_time: 1,
                departure_date: 1,
                arrival_date: 1,
                arrival_time: 1,
                airline_id: 1,
            },
        },
    ]);
    console.log(result);
    return result
  } catch (error) {
      console.error('Error performing aggregation:', error);
      throw error
  }
}

module.exports.updateseatbooked = async(flight_Id, seat_num) => {
  try {
    const f_Id = new mongoose.Types.ObjectId(flight_Id);
    // Using findOneAndUpdate with arrayFilters
    const updatedFlight = await Flights.findOneAndUpdate(
        { _id: f_Id, "seat_map.seat_num": seat_num },
        { $set: { "seat_map.$.booked": true } },
        { new: true } // This option returns the updated document
    ).lean();

    if (!updatedFlight) {
        throw new Error('Flight or seat not found');
    }

    console.log('Updated flight:', updatedFlight);
    return updatedFlight;
} catch (err) {
    console.error('Error updating seat status:', err);
    throw err;
}
}

module.exports.createFlightrec = async(flightrec) => {
    const flightobj =  await Flights.create(flightrec);
    return flightobj
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;