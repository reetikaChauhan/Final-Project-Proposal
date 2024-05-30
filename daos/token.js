const User = require("../models/user")
const jwt = require('jsonwebtoken');

module.exports = {};

module.exports.makeTokenForUserId = async(userId) => {
    try{
        const userrecord =  await User.findOne({_id : userId}).lean()
        const secretKey = "e87a47b5a9a10e605ae5463e6c1320fb7bfbb4198c41db00a78a68b3c92a01d1"
        const payload = {
            _id : userId,
            email : userrecord.email,
            roles : userrecord.roles
        }
        // Creating the token
        const token = jwt.sign(payload, secretKey);
        return token
    }catch(e){
        throw e;
    }
}

module.exports.getUserFromToken = async (tokenString) => {
    const secretKey = "e87a47b5a9a10e605ae5463e6c1320fb7bfbb4198c41db00a78a68b3c92a01d1";

    return new Promise((resolve, reject) => {
        jwt.verify(tokenString, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;