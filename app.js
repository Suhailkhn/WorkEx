//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.locals.utility = require('./utility.js');

/**********************************************************************/

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/WorkExDB", {useNewUrlParser: true, autoIndex: false});
mongoose.set("useCreateIndex", true);

const noteSchema = new mongoose.Schema({
  isImportant: Boolean,
  content: String
});
noteSchema.set('timestamps', true);

const jobSchema = new mongoose.Schema({
  designation: String,
  companyName: String,
  url: String,
  city: String,
  cityCode: String,
  countryCode: String,
  startDate: Date,
  endDate: Date,
  isCurrentJob: Boolean,
  notes: [noteSchema]
});

const userSchema = new mongoose.Schema ({
  name: String,
  socialProfileId: String,
  jobs: [jobSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);
const Job = new mongoose.model("Job", jobSchema);
const Note = new mongoose.model("Note", noteSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


/**********************************************************************/

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/workex",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ socialProfileId: profile.id, name: profile.displayName, username: profile.id }, function (err, user) {
        //console.log(profile);
        return cb(err, user);
    });
  }
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/workex', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    res.redirect('/home');
  });



/**********************************************************************/

app.get("/", function(req, res){
    res.sendFile("./public/landing-page/index.html", {root: __dirname});
});

app.get("/home", function(req, res){
    User.findOne({_id : req.user.id}, function(err, foundUser) {
      if(err) {
        console.log("Error occured: " + err);
        res.redirect("/");
      } else {
        res.render("home", {title: "Home - Your Jobs", name: req.user.name, jobList: foundUser.jobs, 
                            userAgentString: req.headers["user-agent"]});
      }
    });
});

app.get("/job-:jobId", function(req, res) {
    const foundJob = req.user.jobs.id(req.params.jobId);
    if(foundJob === undefined || foundJob == null) {
      res.redirect("/home");
    } else {
      res.render("job-notes", {title: "Your Experiences At This Job", name: req.user.name, job: foundJob, notes: foundJob.notes});
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.post("/save-job", function(req, res) {
    const job = new Job ({
        designation: req.body.designation,
        companyName: req.body.companyName,
        url: req.body.url,
        city: req.body.city,
        countryCode: req.body.country,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        isCurrentJob: req.body.currentJob == 'on' ? true : false
    });
    job.save();
    console.log("job saved.");
    User.findOne({_id : req.user.id}, function(err, foundUser) {
        if(err) {
          console.log("Error occured: " + err);
        } else {
          foundUser.jobs.unshift(job);
          foundUser.save();
        }
    });
    res.redirect("/home");
});

app.post("/save-note", function(req, res) {
    const note = new Note({
      isImportant: false,
      content: req.body.itemContent
    });
    note.save();

    Job.findOne({_id : req.body.jobId}, function(err, foundJob) {
      if(err) {
        console.log("Could not find job: " + err);
      } else {
        foundJob.notes.unshift(note);
        foundJob.save();
      }
    });

    User.findOne({_id : req.user.id}, function(err, foundUser) {
      if(err) {
        console.log("Could not find User: " + err);
      } else {
        const foundJob = foundUser.jobs.id(req.body.jobId);
        if(foundJob === undefined || foundJob === null) {
          console.log("Error occured while trying to find job to save a note.");
        } else {
          foundJob.notes.unshift(note);
          foundUser.save();
        }
      }
    });

    res.redirect("/job-" + req.body.jobId);
});

app.listen(3000, function() {
    console.log("Server started on port 3000.");
});