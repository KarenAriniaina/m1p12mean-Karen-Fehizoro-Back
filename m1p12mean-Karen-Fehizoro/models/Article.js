const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ArticleSchema = new mongoose.Schema({
    _id: Number,
    title: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

ArticleSchema.plugin(AutoIncrement, { id: "article_id_seq", inc_field: "_id" });

module.exports = mongoose.model('Article', ArticleSchema);
