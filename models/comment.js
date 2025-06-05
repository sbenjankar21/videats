/**
 * User Schema
 */
const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    },
    body:
    {
        type: String,
        required: true
    },
    video:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Video"
    }



})

module.exports = mongoose.model('Comment', commentSchema)