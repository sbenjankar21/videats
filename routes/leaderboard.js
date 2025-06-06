/**
 * proxy router
 */
const express = require('express')
const axios = require('axios')
const router = express.Router()

const User = require('../models/user')

// checks if user is logged in
function checkAuthenticated(req, res, next)
{
    if(req.isAuthenticated()) 
    {
        return next()
    }

    res.redirect('/login')
}


// proxy router
router.get('/',  async (req, res) => {

const users = await User.find().sort({totalStars: -1})

    res.render('leaderboard', {users: users,isLoggedIn: req.isAuthenticated()});

})

module.exports = router