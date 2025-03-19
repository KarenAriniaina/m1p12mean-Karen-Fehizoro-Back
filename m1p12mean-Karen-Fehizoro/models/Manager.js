const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ManagertSchema = new mongoose.Schema({
    _id: Number,
   
    prenom :  { type: String, required: true },
    login :  { type: String, required: true,unique: true },
    mdp :  { type: String, required: true },
}, { timestamps: true });

ManagertSchema.plugin(AutoIncrement, { id: "manager_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Manager', ManagertSchema);

