const express = require('express');
const router = express.Router();
const Video = require('../models/video')
const User = require('../models/user')
const axios = require('axios')

function checkAuthenticated(req, res, next)
{
    if(req.isAuthenticated()) 
    {
        return next()
    }

    res.redirect('/login?from=upload')
}
function getSecondPart(str) {
    var mySubString

    if(str.indexOf("https://youtu.be/") !== -1)
    {
        mySubString = str.substring(
            str.lastIndexOf("/") + 1, 
            str.indexOf("?")
        );
    }
    
    else if(str.indexOf("&") !== -1)
    {
        mySubString = str.substring(
            str.indexOf("=") + 1, 
            str.indexOf("&")
        );
    }

    else
    {
        mySubString = str.split('=')[1];
    }

    return mySubString;
}

// function to make a request to a url
async function httpGet(theUrl)
{
    // try this
    try
    {
        const response = await axios({
            method: 'GET',
            url: theUrl
        });

        return response.data;

    }

    // otherwise
    catch(error)
    {
        // if theres an error do this stuff but i never bothered to fill it out probaly should
        if(error.response)
        {

        }

        else if(error.request)
        {

        }
        else
        {

        }
        console.log(error.config)
    }
}


router.get('/', checkAuthenticated, (req, res) => {

    res.render('upload', {isLoggedIn: req.isAuthenticated()});
})



router.post('/', checkAuthenticated, async (req, res) =>{
console.log(req.body);
var link = req.body.link;
var tags = req.body.tags;

console.log(link);
console.log(tags);
    try
    {
    // video api link

    var vidId = getSecondPart(link);
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+vidId+'&fields=items(id,snippet)&key=AIzaSyARlc8Jj0BqWyLS7DpFbkyZ6SHNyUepuqQ'

    // make a request to the api and record the response in vid
    var vid = await httpGet(url)

    // look for vides with the same imageAddress
    var vids = await Video.find({imageAddress: "https://img.youtube.com/vi/"+vidId+"/hq720.jpg"});

    // ion know why i did this but too lazy to fix it
    //var videoJson = vid //------

    // create a new video
    const video = new Video(
    {
        title: vid.items[0].snippet.title,
        link: link,
        author: vid.items[0].snippet.channelTitle,
        totalStars: 0,
        stars: 0,
        datePosted: Date.now(),
        imageAddress: "https://img.youtube.com/vi/"+vidId+"/hq720.jpg",
        averageStars: 0,
        youtubeId: vidId,
        backgroundColor: req.body.bgcolor,
        tags: req.body.tags,
        postedBy: req.user
    })


    // if vids length is 0 that means its a new video
    if(vids.length === 0)
    {

        try
        {
            // save the video
            const newVideo = await video.save()

            //cib
            await User.updateOne({_id: req.user._id}, {$set:{totalUploaded:  req.user.totalUploaded + 1}, $push: { uploadedVideos: newVideo }})
             //await User.updateOne({ _id: req.user.id }, )
            // redirect to the new video's page
            res.redirect(`videos/${newVideo.id}`)

        }

        // on error do this
        catch(e)
        {
            // log the error and render the page agian with an error message
            console.log(e)
            res.render('/',{
                video: video,
                errorMessage: 'Error Creating Video...'
            })
        }
        console.log("the video was saved gng");

        const testVideos = await Video.find();
        console.log(testVideos);
    }

    // otherwise the video already exists
    else
    {


        // render the html FIX IT BITCHHH IT DOESNT WORK
        res.render('videos/new',{
            video: vids[0],
            errorMessage: 'review made'
        })
        
    }
             
    }

    // otherwiese
    catch(e)
    {
        // log the error and render the page again with an error message
        console.log(e)
        res.render('videos/new',{
            video: {link: req.body.name},
            errorMessage: 'Error Creating Video...',
            isLoggedIn: req.isAuthenticated()
        })
    }


});

module.exports = router;