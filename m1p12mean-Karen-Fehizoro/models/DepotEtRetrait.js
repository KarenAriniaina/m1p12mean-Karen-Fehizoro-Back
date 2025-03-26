const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DepotEtRetrait = new mongoose.Schema({
    _id: Number,
    date: { type: Date, default: Date.now, },
    id_client :{ type: Number, required: true },
    depot: { type: Number, default :0},
    retrait: { type: Number, default :0 },
}, { timestamps: true });

DepotEtRetrait.plugin(AutoIncrement, { id: "depotEtRetrait_id_seq", inc_field: "_id" })

module.exports = mongoose.model('DepotEtRetrait', DepotEtRetrait);
