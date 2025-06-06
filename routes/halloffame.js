const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

    res.render('halloffame', {isLoggedIn: req.isAuthenticated(), tabTitle: "VidEats Hall of Fame"});
})

module.exports = router;