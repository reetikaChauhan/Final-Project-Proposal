const Airport = require('../models/airports');


module.exports = {};



module.exports.getAirport = async() => {
  const airports =  await Airport.find().lean();
  return airports
}


module.exports.getAirportById = async (airportId) => {
    const airport =  await Airport.find({_id:airportId}).lean();
    return airport
}
module.exports.getAirportByCity = async (location) => {
  return await Airport.find(
    { $text: { $search: location } },
    { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } })  
}
module.exports.createAirportrec = async(aid,airportrec) => {
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

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;