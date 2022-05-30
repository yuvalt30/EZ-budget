const mongoose = require("mongoose")

const PlanSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    subSections: {
        type: String,
        required : true,
    },
    amount : {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Plan", PlanSchema)