const mongoose = require("mongoose")
const Trans = require("./Transaction")
const SubTrack = require("./SubTrack")

const SectionTrackSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    income: { 
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    outcome: { 
        type: Array,
        required: true,
        default: [0,0,0,0,0,0,0,0,0,0,0,0]
    },
    // updated: {
    //     type: Date,
    //     reqyured: true,
    //     Default: new Date(1970,1,1,1,1,1)
    // }

});

// SectionTrackSchema.method('isOutOfdate', function() { return Trans.find({ date: {"$gte": this.updated} })}); //TODO: need fix

SectionTrackSchema.method('monthlyIncome', function() { return SubTrack.getSectorMontlyPlan(this.section, this.year)});


module.exports = mongoose.model("SectionTrack", SectionTrackSchema)