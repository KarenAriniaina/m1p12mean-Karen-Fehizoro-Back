const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ServicetSchema = new mongoose.Schema({
    _id: Number,
    nom : { type: String, required: true },
    tarif : { type: Number, required: true , default: 0 },
    estimation : { type: String, required: true },
    nbrmeca : { type: Number, required: true, default: 0 },

}, { timestamps: true });

ServicetSchema.plugin(AutoIncrement, { id: "service_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Service', ServicetSchema);

