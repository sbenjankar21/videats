/**
 * User Schema
 */
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username:
    {
        type: String,
        required: true
    },
    email:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    friends:
    {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "User"
    },
    totalStars:
    {
        type: Number,
        required: true
    },
    possibleStars:
    {
        type:Number,
        required: true
    },
    totalUploaded:
    {
        type: Number,
        required: true
    },
    totalRated:
    {
        type: Number,
        required: true
    },
    uploadedVideos:
    {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "Video"
    },
    ratings:
    {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: "Rating" 
    },
    comments:
    {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "Comment"
    }



})

module.exports = mongoose.model('User', userSchema)