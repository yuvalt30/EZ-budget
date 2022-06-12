const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        default:"anonymous"
    },
    email: {
        type:String,
        required:true,
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
    }
})

module.exports = mongoose.model("Users", usersSchema)