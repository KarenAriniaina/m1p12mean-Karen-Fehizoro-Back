const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const MecanicienSchema = new mongoose.Schema({
    _id: Number,
    nom :  { type: String, required: true },
    prenom :  { type: String, required: true },
    login :  { type: String, required: true },
    mdp :  { type: String, required: true },
    email :  { type: String, required: true },
    numtel :  { type: String, required: true },
    adresse :  { type: String, required: true },
    
}, { timestamps: true });

MecanicienSchema.plugin(AutoIncrement, { id: "mecanicien_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Mecanicien', MecanicienSchema);

