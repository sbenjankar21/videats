const express = require('express')
const axios = require('axios')
const router = express.Router()
const passport = require('passport')
const initializePassport = require('../passport-config')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')


//checks if the user is not logged in
function notAuthenticated(req, res, next)
{
    if(req.isAuthenticated()) {
    return res.redirect('/')
    }

    next()
}

// WEBSITE/login router
router.get('/', notAuthenticated,(req, res) => {

    var from = "";

    if(req.query.from)
    {
        from = "/"+req.query.from;
    }

    res.render('login',{from: from, layout: false})
})



// post router, and authenticate credentials
router.post('/',  notAuthenticated, passport.authenticate('local',{

    failureRedirect: '/login',
    failureFlash: true

}), (req, res) => { 
    
    var from = "";
    if(req.query.from)
    {
        from = req.query.from;
    }
    
    res.redirect('.'+from);

})



module.exports = router