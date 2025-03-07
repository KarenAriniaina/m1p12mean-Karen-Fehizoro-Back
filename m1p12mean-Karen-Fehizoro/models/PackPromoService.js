const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Service = require('./Service')


const ServiceSchema = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true },
    tarif: { type: Number, required: true, default: 0 },
    estimation: { type: String, required: true },
    nbrmeca: { type: Number, required: true, default: 0 }
}, { timestamps: true });


const PackPromoServicetSchema = new mongoose.Schema({
    _id: Number,
    prenom :  { type: String, required: true },
    service : [{  type: [ServiceSchema], required: true }] ,
    dateDebut:{ type: Date, required: true },
    dateFin: { type: Date, required: true  },
    idservice: { type: Number, required: true }
}, { timestamps: true });

PackPromoServicetSchema.plugin(AutoIncrement, { id: "packPromoService_id_seq", inc_field: "_id" });

module.exports = mongoose.model('PackPromoService', PackPromoServicetSchema);

