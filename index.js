var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var dbFacade = require('./data_layer/dbFacade.js');

var PORT = process.env.PORT || 3000;

app
.use(express.static(path.join(__dirname, 'public')))
.use(bodyParser.json())
.get('/projects/:id', dbFacade.getProjects)
.get('/users/:id', dbFacade.getUserDonations)
.post('/donate', dbFacade.addDonation)
.get('/', (req, res) =>{
    res.redirect('/roadsToPeace.html');
})
.listen(PORT, function() {
    console.log("server listening on port " + PORT);
});