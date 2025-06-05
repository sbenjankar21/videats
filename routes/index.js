const express = require('express');
const router = express.Router();
const passport = require('passport')
const Video = require('../models/video');


function isToday(isoDateString) {
  const inputDate = new Date(isoDateString);
  const today = new Date();

    console.log("Input: "+ inputDate);
    console.log("Today: "+ today);

  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
}
router.get('/', async (req, res) => {

 const vids = await Video.find().sort({datePosted: -1});
console.log(vids.length);
 const vidsToday = vids.filter((vids) => isToday(vids.datePosted))

 var vidsSortedByTop = await Video.find().sort({averageStars: -1});

  vidsSortedByTop = vidsSortedByTop.filter((vids) => isToday(vids.datePosted))

 console.log(vidsToday)
 console.log(vidsToday.length);



    res.render('index', {newVids: vidsToday, bestToday: vidsSortedByTop, isLoggedIn: req.isAuthenticated()});
})

module.exports = router;