const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const Service = require('./Service')


const ServiceSchema = new mongoose.Schema({
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
        required: true
    },
    photo: {
        type: [String],
        default: []
    },
    description:{
        type:String
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
    },
    description:{
        type:String
    }
}, { timestamps: true });

PackPromoServiceSchema.pre('save', async function (next) {
    // Convert the fields to numbers
    if (typeof this.tarif === 'string') {
        this.tarif = parseFloat(this.tarif);
    }

    // Validation checks for the fields
    if (this.tarif <= 0) {
        return next(new Error('Le tarif saisi est inférieur ou égal à 0'));
    }

    if (this.service.length == 0) {
        if (this.idservice == 0) return next(new Error('Aucun service saisi pour le pack '));
        else return next(new Error('Aucun service saisi pour la promo'));
    }

    const moment = require('moment-timezone');

    const now = moment(new Date()).tz(process.env.TZ || 'UTC');
    this.dateDebut = moment(this.dateDebut).tz(process.env.TZ || 'UTC');
    this.dateFin = moment(this.dateFin).tz(process.env.TZ || 'UTC');
    if (this.dateDebut < now) {
        return next(new Error("La date de début saisie est inférieure à la date en cours"));
    }
    if (this.dateFin < now) {
        return next(new Error("La date de fin saisie est inférieure à la date en cours"));
    }
    if (this.dateDebut >= this.dateFin) {
        return next(new Error("La date de fin saisie est inférieure à la date de début"));
    }

    if(this.idservice!=0){
        if(this.service[0].tarif<=this.tarif) return next(new Error("Le prix saisi est supérieur au prix normal"));
    }

    const existingPack = await mongoose.model('PackPromoService').findOne({
        "idservice": this.idservice, // Check if service already exists
        $or: [
            {
                dateDebut: { $lte: this.dateFin },
                dateFin: { $gte: this.dateDebut }
            }
        ]
    });
    if ((existingPack && !this._id) || (existingPack && this._id && this._id != existingPack._id)) {
        if (this.idservice == 0) {
            if(existingPack.nom===this.nom)  return next(new Error("Un pack est déjà actif avec le nom saisi"));
        }
        else return next(new Error("Un promo est déjà actif avec le nom saisi"));

    }
    next();
});

PackPromoServiceSchema.plugin(AutoIncrement, { id: "packPromoService_id_seq", inc_field: "_id" });

module.exports = mongoose.model('PackPromoService', PackPromoServiceSchema);

