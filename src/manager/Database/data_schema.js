const { Schema, model } = require("mongoose");

const dataSchema = new Schema({
    deliveryCode: { type: String },
    owoCash: { type: String },
    creatorID: { type: String},
    createdDate: { type: Date }
});

module.exports = model("data_schema", dataSchema);