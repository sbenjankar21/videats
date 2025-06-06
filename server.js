// load environment variables
if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

//use User model
const User = require('./models/user')
const Video = require('./models/video')
//use express
const express = require('express');

//set the app to express
const app = express();

// create the layouts
const expressLayouts = require('express-ejs-layouts');

//this allows us to parese the boy of requests
const bodyParser = require('body-parser')


// this allows us to show messages
const flash = require('express-flash')

// this allows us to have sessions
const session = require('express-session')

// this library is for authentication
const passport = require('passport')


// uses the passprot config
const initializePassport = require('./passport-config')

//allows us to use DELETE rest
const methodOverride = require('method-override')

//initialize the passport
   //const video = await Video.findById(req.params.id).populate({path: "comments", populate: {path: "user"}})
initializePassport(passport, email =>  User.findOne({email: email}),  id =>  User.findById(id).populate({ path: 'friends uploadedVideos', options: { retainNullValues: true } }).populate({path: "comments", populate: {path: "video"}}).populate({path: "ratings", populate: {path: "video"}})
)


//declare all the routers we are using
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const profileRouter = require('./routes/profile');
const proxyRouter = require('./routes/proxy');
const videosRouter = require('./routes/videos');
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const leaderboardRouter = require('./routes/leaderboard')
const halloffameRouter = require('./routes/halloffame')

// set the view engine
app.set('view engine', 'ejs')

//set views
app.set('views', __dirname + '/views')

//set the layout
app.set('layout', 'layouts/layout')

// use express layouts
app.use(expressLayouts)

//set the directory of our static images
app.use(express.static('public'))

// allowws us to parse json in body of requests
app.use(bodyParser.json());

// allows us to parse as well
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// allows us to use flash
app.use(flash())

// allows us to use sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false
}))

//allows us to use passport and authenticate 
app.use(passport.initialize())

//allows us to use passport sennions
app.use(passport.session())

//uses methodOverride so we can use DELETE api
app.use(methodOverride('_method'))


//declare mongoose
const mongoose = require('mongoose');

// connect too the database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});


// set db as our databse
const db = mongoose.connection

// log an error it theres an error
db.on('error', error => console.error(error))

// if it's connnected say this
db.once('open', () => console.log("Connected gng"))


//use all the routes
app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/profile', profileRouter);
app.use('/proxy', proxyRouter);
app.use('/videos', videosRouter);
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/halloffame', halloffameRouter)

//allows us to delete
app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

app.use((req, res, next) => {
  res.status(404).render('404', {isLoggedIn: req.isAuthenticated()}); // Or res.send('404 page not found!');
});

// listen on this port
app.listen(process.env.PORT || 3000);