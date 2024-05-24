const Passenger = require('../models/passenger');

module.exports = {};

module.exports.getPassengers = async() => {
  const passengers =  await Passenger.find().lean();
  return passengers
}


module.exports.getPassengersById = async (passengerId) => {
    const passenger =  await Passenger.find({ _id: passengerId }).lean();
    return passenger
}

module.exports.passengerrec = async(userrec, userinfo) => {
    passenginfo = {
        userId: userrec._id,
        name: userinfo.name,
        phone: userinfo.phone
    }
    const passengerobj =  await Passenger.create(passenginfo);
    return passengerobj
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;