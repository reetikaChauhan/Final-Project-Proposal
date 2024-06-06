const Airport = require('../models/airports');
const mongoose = require('mongoose');

module.exports = {};



module.exports.getAirport = async() => {
  const airports =  await Airport.find().lean();
  return airports
}


module.exports.getAirportById = async (airportId) => {
  if (!mongoose.Types.ObjectId.isValid(airportId)) {
    return null;
  }
    const airport =  await Airport.findOne({_id:airportId}).lean();
    return airport
}
module.exports.getAirportByCity = async (location) => {
  return await Airport.find(
    { $text: { $search: location } },
    { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } })  
}
module.exports.updateAirport = async(aid,airportrec) => {
  if (!mongoose.Types.ObjectId.isValid(aid)) {
    return false;
  }
  const airportobj =  await Airport.updateOne({_id:aid},airportrec);
  return airportobj
}


module.exports.createAirportrec = async(airportrec) => {
    const airportobj =  await Airport.create(airportrec);
    return airportobj
}

module.exports.deleteById = async (aId) => {
  if (!mongoose.Types.ObjectId.isValid(aId)) {
    return false;
  }
  await Airport.deleteOne({ _id: aId });
  return true;
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;