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
  try{
  if (!mongoose.Types.ObjectId.isValid(aid)) {
    return false;
  }
  const airlineobj =  await Airlines.updateOne({_id:aid},airlinerec);
  return airlineobj
} catch(error){
    console.log("error in update daos", error)
}
}

module.exports.createAirlinesrec = async(airlinerec) => {
    const airlineobj =  await Airlines.create(airlinerec);
    return airlineobj
}
module.exports.deleteById = async (aId) => {
  if (!mongoose.Types.ObjectId.isValid(aId)) {
    return false;
  }
  await Airlines.deleteOne({ _id: aId });
  return true;
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;