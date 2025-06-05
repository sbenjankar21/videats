const express = require('express');
const router = express.Router();
const User = require('../models/user')

function checkAuthenticated(req, res, next)
{
    if(req.isAuthenticated()) 
    {
        return next()
    }

    res.redirect('/login?from=profile')
}


router.get('/', checkAuthenticated, async (req, res) => {

// const currentUser = await User.findById(req.user._id).populate('friends').populate('likedVideos').populate({ path: 'favoriteSongs favoriteMovies', options: { retainNullValues: true } })
   // let main = true;
    console.log(req.user)
    res.render('profile', {user: req.user, isLoggedIn: req.isAuthenticated(), isMain: true});
})


router.get('/:id', async (req, res) => {

// const currentUser = await User.findById(req.user._id).populate('friends').populate('likedVideos').populate({ path: 'favoriteSongs favoriteMovies', options: { retainNullValues: true } })
const currentUser = await User.findById(req.params.id).populate({ path: 'friends uploadedVideos', options: { retainNullValues: true } }).populate({path: "comments", populate: {path: "video"}}).populate({path: "ratings", populate: {path: "video"}});
    //console.log(req.user)
    res.render('profile', {user: currentUser, isLoggedIn: req.isAuthenticated(), isMain: false});
})


module.exports = router;