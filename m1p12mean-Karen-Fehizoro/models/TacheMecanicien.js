const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TacheMecanicienSchema  = new mongoose.Schema({
    _id: Number,
    idMeca : { type: Number, required: true , default: 0},
    idfact : { type: Number, required: true , default: 0 },
    idservice : { type: Number, required: true },
    dateDebut:{ type: Date, required: true },
    dateFin: { type: Date, required: false  },
    status: { type: Number, required: true  },
    estimation: { type: Date, required: true  },
    idDemande : {type: Number ,required: false , default: 0 }
}, { timestamps: true });

TacheMecanicienSchema.plugin(AutoIncrement, { id: "tacheMecanicien_id_seq", inc_field: "_id" });

module.exports = mongoose.model('TacheMecanicien', TacheMecanicienSchema );

