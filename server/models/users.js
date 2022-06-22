const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        default:"anonymous"
    },
    email: {
        type:String,
        lowercase: true,
    },
    password: {
        type:String,
        required:true,
    },
    role: {
        type:String,
        required:true,
        default:"employee"
    },
    permissions: {
        type:[String],
    },
    startMonth: {
        type: Number,
        default: 0,
        min: [0,"month is between 0 and 11"],
        max: [11,"month is between 0 and 11"]
    }
})

module.exports = mongoose.model("Users", usersSchema)