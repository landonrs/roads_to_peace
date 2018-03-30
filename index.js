var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var dbFacade = require('./data_layer/dbFacade.js');

var PORT = process.env.PORT || 3000;

app
.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true,cookie: { maxAge: 600000 }}))
.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.json())
.get('/projects/main', dbFacade.displayProjectPage)
.get('/projects/:id', dbFacade.getProject)
.get('/users/:id', dbFacade.getUserDonations)
.post('/donate', dbFacade.addDonation)
.post('/login', dbFacade.logInUser)
.post('/addUser', dbFacade.addUser)
.get('/', (req, res) =>{
    res.redirect('/roadsToPeace.html');
})
.get('/checkLogIn', checkLogIn)
.listen(PORT, function() {
    console.log("server listening on port " + PORT);
});


function checkLogIn(req, res, next){

    if(req.session.userID){
        console.log("Logged in");
        res.send({login: req.session.username, user_id: req.session.userID})
    }
    else{
        console.log("Not Logged IN!")
        res.send({login: null})
    }
}