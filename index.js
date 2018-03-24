var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var dbFacade = require('./data_layer/dbFacade.js');

var PORT = process.env.PORT || 3000;

app
.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true,cookie: { maxAge: 60000 }}))
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
.listen(PORT, function() {
    console.log("server listening on port " + PORT);
});