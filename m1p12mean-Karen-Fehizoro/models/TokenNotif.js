const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TokenSchema = new mongoose.Schema({
    _id: Number,
    token: { type: String, unique: true, required: true },
    iduser: { type: Number, default: null },
    typeuser: { type:Number, default: 2}
});
// typeuser=0 si admin  1 si meca 2 si client

TokenSchema.plugin(AutoIncrement, { id: "token_id_seq", inc_field: "_id" });

module.exports = mongoose.model("TokenNotif", TokenSchema);