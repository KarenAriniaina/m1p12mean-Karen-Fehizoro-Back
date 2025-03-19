const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ServicetSchema = new mongoose.Schema({
    _id: Number,
    nom: { type: String, required: true, unique: true },

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

// Pre-save hook to ensure conversion of string to number
ServicetSchema.pre('save', function (next) {
    // Convert the fields to numbers
    if (typeof this.tarif === 'string') {
        this.tarif = parseFloat(this.tarif);
    }
    if (typeof this.estimation === 'string') {
        this.estimation = parseFloat(this.estimation);
    }
    
    if (this.nbrmeca % 1 !== 0) { // This checks if the number is not an integer
        return next(new Error("Le nombre de mécanicien doit être un entier"));
    }

    if (typeof this.nbrmeca === 'string') {
        this.nbrmeca = parseInt(this.nbrmeca, 10);
    }

    // Validation checks for the fields
    if (this.tarif <= 0) {
        return next(new Error('Le tarif saisi est inférieur ou égal à 0'));
    }
    if (this.estimation <= 0) {
        return next(new Error("L'estimation saisie est inférieure ou égale à 0"));
    }
    if (this.nbrmeca <= 0) {
        return next(new Error("Le nombre de mécanicien choisi est inférieur ou égal à 0"));
    }

    next();
});

ServicetSchema.plugin(AutoIncrement, { id: "service_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Service', ServicetSchema);
