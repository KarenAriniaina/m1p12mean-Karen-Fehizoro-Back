const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Service = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true },
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
    },
    photo: {
        type: [String],
        default: []
    },
    description: {
        type: String
    }
}, { timestamps: true });


const PackPromoService = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true },
    service: { type: [Service], required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    idservice: { type: Number, required: true },
    tarif: { type: Number, required: true, default: 0 },
    statut: { type: Number, default: 0 },
    photo: {
        type: [String],
        default: []
    },
    description: {
        type: String
    }
}, { timestamps: true });

const FactureSchema = new mongoose.Schema({
    _id: Number,
    idClient: { type: Number, required: true },
    pack: {
        type: [PackPromoService], // Array of embedded PackPromoService documents
        required: true,
        default: []
    },
    services: {
        type: [Service], // Array of embedded Service documents
        required: true,
        default: []
    },
    total: { type: Number, required: true, default: 0 },
    datefact: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

FactureSchema.plugin(AutoIncrement, { id: "facture_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Facture', FactureSchema);

