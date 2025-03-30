const mongoose = require("mongoose");
const PackPromoService = require("./PackPromoService");
const Service = require("./Service");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FactureSchema = new mongoose.Schema({
    _id: Number,
    idClient :  { type: Number, required: true },
    pack :  { type: [PackPromoService], required: true , default : [] },
    services :  { type: [Service], required: true, default : []},
    total :  { type: Number, required: true , default : 0 },
}, { timestamps: true });

FactureSchema.plugin(AutoIncrement, { id: "facture_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Facture', FactureSchema);

