const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const ServiceSchema = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true},   

    tarif: {
        type: Number,
        required: true
    },

    estimation: {
        type: Number,
        required: true
    },

    nbrmeca: {
        type: Number,
        required: true
    },
    photo: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const PackPromoServiceSchema = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true },
    service: { type: [ServiceSchema], required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    idservice: { type: Number, required: true },
    tarif: { type: Number, required: true, default: 0 },
    statut: { type: Number, default: 0 },
    photo: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const FactureSchema = new mongoose.Schema({
    _id: Number,
    idClient :  { type: Number, required: true },
    pack :  { type: [PackPromoServiceSchema], required: true , default : [] },
    services :  { type: [ServiceSchema], required: true, default : []},
    total :  { type: Number, required: true , default : 0 },
}, { timestamps: true });

FactureSchema.plugin(AutoIncrement, { id: "facture_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Facture', FactureSchema);

