const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ClientSchema = new mongoose.Schema({
    _id: Number,

    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    login: { type: String, required: true },
    mdp: { type: String, required: true },
    email: { type: String, required: true },
    numtel: { type: String, required: true },
    adresse: { type: String, required: true },
    solde: { type: Number, required: true, default: 0.0 },
}, { timestamps: true });

ClientSchema.plugin(AutoIncrement, { id: "client_id_seq", inc_field: "_id" })

module.exports = mongoose.model('Client', ClientSchema);
