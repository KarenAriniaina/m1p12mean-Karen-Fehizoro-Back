const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const DemandeSchema = new mongoose.Schema({
    _id: Number,
    
   
}, { timestamps: true });

DemandeSchema.plugin(AutoIncrement, { id: "demande_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Demande', DemandeSchema);
