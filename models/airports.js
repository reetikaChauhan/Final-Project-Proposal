const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    name: { type: String,unique:true, required: true },
    code: { type: String,unique:true, required: true },
    location: { type: String,required: true },
    
});

airportSchema.index({ location: 'text' }); 
module.exports = mongoose.model("airports", airportSchema);