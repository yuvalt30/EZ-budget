const mongoose = require("mongoose")
const Trans = require("./Transaction")

const SubTrackSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BudgetSection'
    },
    year: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    monthlyPlan: {
        type: Number,
        required: true,
        default: 0
    },
    exec: { 
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    updated: {
        type: Date,
        reqyured: true,
        Default: new Date(1970,1,1,1,1,1)
    }

});

SubTrackSchema.method('isOutOfdate', function() { return Trans.find({ date: {"$gte": this.updated} })}); //TODO: need fix

SubTrackSchema.static('getSectorMontlyPlan', function(secName) { tracks = this.find().populate({
    path: 'section',
    match: {  }
}) })

module.exports = mongoose.model("SubTrack", SubTrackSchema)