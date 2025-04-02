const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);




const HeureDeTravailSchema = new mongoose.Schema({
    _id: Number,
    heureDebut :  { type: String, required: true },
    heureFin :  { type: String, required: true },

}, { timestamps: true });

HeureDeTravailSchema.plugin(AutoIncrement, { id: "heure_de_travail_id_seq", inc_field: "_id" });

module.exports = mongoose.model('HeureDeTravail', HeureDeTravailSchema);

