const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
    name: { type: String,unique:true, required: true },
    code: { type: String, index: true,required: true },
    
    
});


module.exports = mongoose.model("airlines", airlineSchema);