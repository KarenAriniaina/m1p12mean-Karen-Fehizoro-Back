const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RecetteExceptionnelleSchema  = new mongoose.Schema({
    _id: Number,
    idMeca : { type: Number, required: true , default: 0},
    libelle : { type: Number, required: true , default: 0 },
    total : { type: Number, required: true , default: 0 },
    date:{ type: Date, required: true }
}, { timestamps: true });

RecetteExceptionnelleSchema.plugin(AutoIncrement, { id: "recetteExceptionnelle_id_seq", inc_field: "_id" });

module.exports = mongoose.model('RecetteExceptionnelle', RecetteExceptionnelleSchema );

