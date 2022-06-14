const mongoose = require("mongoose")

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
    exec: { 
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

// SubTrackSchema.method('isOutOfdate', function() { return Trans.find({ date: {$gte: this.updated} })}); //TODO: need fix

SubTrackSchema.static('getSectorMontlyPlan', async function(secName, year) { 
    tracks = await this.find( { year: year } ).populate({
        path: 'section',
        match: {sectionName: secName},
    })
    ret = 0
    tracks.forEach(track => {
        if(track.section){
            ret += track.section.monthlyPlan
        }
    });
    return ret
 })

module.exports = mongoose.model("SubTrack", SubTrackSchema)