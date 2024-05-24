const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, index: true,required: true },
    phone: { type: String, index: true,required: true },
    userId:{  type: mongoose.Schema.Types.ObjectId,
        ref: "user", },
    
});


module.exports = mongoose.model("passenger", passengerSchema);