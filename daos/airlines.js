const Airlines = require('../models/airlines');
const mongoose = require('mongoose');

module.exports = {};



module.exports.getAirlines = async() => {
  const airlines =  await Airlines.find().lean();
  return airlines
}


module.exports.getAirlinesById = async (airlineId) => {
  if (!mongoose.Types.ObjectId.isValid(airlineId)) {
    return null;
  }
    const airlines =  await Airlines.findOne({_id:airlineId}).lean();
    return airlines
}

module.exports.createAirportrec = async(aid,airlinerec) => {
  if (!mongoose.Types.ObjectId.isValid(aid)) {
    return false;
  }
  const airlineobj =  await Airport.updateOne({_id:aid},airlinerec);
  return airlineobj
}

module.exports.createAirlinesrec = async(airlinerec) => {
    const airlineobj =  await Airlines.create(airlinerec);
    return airlineobj
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;