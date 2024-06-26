const { Schema, model } = require("mongoose");

const accountSchema = new Schema({
    id: { type: String, default: "1" },
    accToken: { type: String },
    changeAccount: { type: Boolean }
});

module.exports = model("account_schema", accountSchema);