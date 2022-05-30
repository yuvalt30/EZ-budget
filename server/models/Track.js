const mongoose = require("mongoose")

const ExecutionSchema = new mongoose.Schema({
    year:{type: Number, required: true},
    jan: {type: Number, default: 0 },
    feb: {type: Number, default: 0 },
    mar: {type: Number, default: 0 },
    apr: {type: Number, default: 0 },
    may: {type: Number, default: 0 },
    jun: {type: Number, default: 0 },
    jul: {type: Number, default: 0 },
    aug: {type: Number, default: 0 },
    sep: {type: Number, default: 0 },
    oct: {type: Number, default: 0 },
    nov: {type: Number, default: 0 },
    dec: {type: Number, default: 0 },

});

const TrackSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    subSection: {
        type: String,
        required : true,
    },
    monthlyPlan: {
        type: String,
        required: true,
        default: 0
    },
    exec: {
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    }

});

module.exports = mongoose.model("Track", TrackSchema)