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

module.exports.updateAirlines = async(aid,airlinerec) => {
  console.log("helloooooo")
  try{
  if (!mongoose.Types.ObjectId.isValid(aid)) {
    console.log("helloooooo")
    return false;
  }
  const airlineobj =  await Airlines.updateOne({_id:aid},airlinerec);
  console.log("airlineobjupdate", airlineobj  )
  return airlineobj
} catch(error){
    console.log("error in update daos", error)
}
}

module.exports.createAirlinesrec = async(airlinerec) => {
    const airlineobj =  await Airlines.create(airlinerec);
    return airlineobj
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;