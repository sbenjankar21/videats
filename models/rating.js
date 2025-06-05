/**
 * User Schema
 */
const mongoose = require('mongoose')
const ratingSchema = new mongoose.Schema({
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User"
    },
    amount:
    {
        type: Number,
        required: true
    },
    video:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Video"
    }



})

module.exports = mongoose.model('Rating', ratingSchema)