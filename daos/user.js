const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports = {};



module.exports.getUser = async(email) => {
  const userrecord =  await User.findOne({ email:email }).lean();
  return userrecord
}


module.exports.updateUserPassword = async (userId, password) => {
  const hashedPassword = await bcrypt.hash(password, 5); // Hash the password
  return await User.updateOne({ _id:userId }, {password: hashedPassword});
}

module.exports.create = async(userObj) => {
    try {
        const hashedPassword = await bcrypt.hash(userObj.password, 5); // Hash the password
        const newUser = await User.create({ email: userObj.email, password: hashedPassword, roles:[userObj.roles],name:userObj.name, phone:userObj.phone }); // Create the user

        return newUser;
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            throw new BadDataError('Email already exists');
        }
        throw error;
    }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;