const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const User = require('../models/user')
const Comment = require('../models/comment')
const Rating = require('../models/rating')


function checkAuthenticated(req, res, next)
{
    if(req.isAuthenticated()) 
    {
        return next()
    }

    res.redirect('/login?from=videos/'+req.params.id)
}
router.get('/', async (req, res) => {

     // declare search options and sortoptons
    let searchOptions = {}
    let sortOptions = {}
    //console.log("IM GOIND OSMETHING")
    //console.log(req.query.tags)
    // make sure the req field isnt blank maybe change the name
    if(req.query.name != null & req.query.name !== "")
    {
        // create a regex
        searchOptions.title = new RegExp(req.query.name, 'i')
    }

    // sort by newest
    if(req.query.sort === "a")
    {
        sortOptions.datePosted = -1;
    }

    // sort by oldest
    else if(req.query.sort === "b")
    {
        sortOptions.datePosted = 1;
    }

    //sort by highest average
    else if(req.query.sort === "c")
    {
        sortOptions.averageStars = -1;
    }

    // sort by alphabetically title
    else if(req.query.sort === "d")
    {
        sortOptions.title = 1;
    }

        //console.log(req.query.tags);

        var tags = [];
    if(req.query.tags)
    {
        searchOptions.tags = {$all: req.query.tags};
        tags = req.query.tags;
    }

    //console.log(searchOptions);
    //try this
    try
    {
        // find all the viedes with the searchoptions and use the sortOption, collation makes sure... just look it up bruh
        const videos = await Video.find(searchOptions).collation({locale: "en" }).sort(sortOptions)
       
        // render the html
        res.render('videos', {
            videos: videos, 
            searchOptions: req.query,
            tags: tags,
            isLoggedIn: req.isAuthenticated()
        })
    }

    // other wise
    catch(e)
    {
        // log the error and redirect to home page
        console.log(e)
        res.redirect('/')
    }
})



// new view route
router.get('/:id', async (req, res) => {

    //console.log("JALEN BRUNSON");
    var passUserRating = 0;
    // try this
    try 
    {
        // get the video from the url idanswers.findOne()
  const video = await Video.findById(req.params.id).populate({path: "comments", populate: {path: "user"}})
        if(req.user)
        {

        
      
       const sessionUser = await req.user.populate({path: "ratings", populate: {path: "video"}})




        var ratingSearch = sessionUser.ratings.find(rating => {
      return rating.video._id.equals(req.params.id)})


           if(ratingSearch !== undefined)
    {
      //console.log("ALREADY RATED")
      passUserRating = ratingSearch.amount;
    }

    else
    {
        //console.log("NEW RATING")
    }

}
        //const test = await User.find().populate({path: "ratings", populate: {path: "video"}});
        //console.log(test.ratings);
        //console.log(userVids);

 //console.log(video.comments);
        // get the corresponding reviews
        //const reviews = await Review.find({video: video}).populate(["video"])

        // render the page 
        res.render('videoView', {
            video: video,
            userR: passUserRating,
            isLoggedIn: req.isAuthenticated()
            //reviews: reviews
            //booksByVideo: books
        })

    } 
    
    //otherwise
    catch (e)
    {
        // redirect home
        //console.log("HELLO")
        console.log(e)
        res.redirect('/')
    }
})


router.post('/:id', checkAuthenticated, async (req, res) => {

        // get the video from the url id


     let increasing = parseInt(req.body.rating)/2


     //console.log("YOOOOOOOOOOOOOOOOOOO: " + increasing)
        const thisVideo = await Video.findById(req.params.id).populate(["postedBy"])


// calculate the new given stars
       
        //console.log("HEE FRE FO BREAK")
        //console.log(thisVideo)




    const userLoggedIn = await req.user.populate({path: "ratings", populate: {path: "video"}})

    var ratingSearch = userLoggedIn.ratings.find(rating => {
      return rating.video._id.equals(req.params.id)})


    if(ratingSearch !== undefined)
    {
      console.log("ALREADY RAATED")

      //console.log(await Rating.find())
      await Rating.updateOne({_id: ratingSearch._id}, {$set:{amount: increasing}})
      //console.log(await Rating.find())

      let starDifference = increasing - ratingSearch.amount;
      let newStars = ratingSearch.video.stars + starDifference;

      let newAverageStars = (newStars/ratingSearch.video.totalStars* 5).toFixed(2); 
      
      console.log("BEFORE")
      console.log(await Video.find())
      await Video.updateOne({_id: ratingSearch.video._id}, {$set:{stars: newStars, averageStars: newAverageStars}})
      console.log("After")
      console.log(await Video.find())
      
      let postedByUser = await User.findById(thisVideo.postedBy._id)

        let newUserStars = postedByUser.totalStars + starDifference;
        await User.updateOne({_id: thisVideo.postedBy._id}, {$set: {totalStars: newUserStars}});

    }

    else
    {
         let newStars = thisVideo.stars + increasing;

        // caluclate the new total stars
        let newTotalStars = thisVideo.totalStars + 5;

        // calculate the new average stars
        let newAverageStars = (newStars/newTotalStars* 5).toFixed(2) 

        //await Video.updateOne(, { $set: { friends: currentUser } })
        await Video.updateOne({ _id: thisVideo._id }, {$set:{stars:  newStars, totalStars: newTotalStars, averageStars: newAverageStars}})

        console.log("NEW RATING")
        let newRating = new Rating({
            user: req.user,
            amount: increasing,
            video: thisVideo
        })

        await newRating.save()
        




       // const userPosted = await User.findById(thisVideo.postedBy._id);
        await User.updateOne({_id: thisVideo.postedBy._id}, {$inc:{totalStars: increasing, possibleStars: 5}})



        await User.updateOne({_id: req.user._id}, {$inc:{totalRated: 1}, $push: {ratings: newRating}})

    } 

    //console.log(await Rating.find())

        

//console.log();






res.sendStatus(201);

})


router.post('/:id/new-comment',checkAuthenticated,  async (req, res) => {
        // find the video the user is trying to like

        //console.log(req.body.body)
        const currentVideo = await Video.findById(req.params.id)

    const newComment = new Comment(
        {
            user: req.user,
            body: req.body.body,
            video: currentVideo
        }
    )

await newComment.save();

await Video.updateOne({_id: currentVideo._id}, {$push: {comments: newComment}})
await User.updateOne({_id: req.user._id}, {$push: {comments: newComment}})


      



res.sendStatus(201);

})
module.exports = router;