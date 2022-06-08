const mongoose = require("mongoose")
const usersSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    role: {
        type:String,
        required:true
    },
    permissions: {
        type:[String],

    }
})

module.exports = mongoose.model("Users", usersSchema)