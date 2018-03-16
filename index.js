var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var dbFacade = require('./dbFacade.js');

var PORT = process.env.PORT || 3000;

app
.use(express.static(path.join(__dirname)))
.use(bodyParser.json())
.get('/projects/:id', dbFacade.getProjects)
.post('/donate', dbFacade.addDonation)
.put('/products/:id', function(req, res){
    var id = req.params.id;
    var newName = req.body.newName;

    var found = false;

    products.forEach(function(product, index){
        if (!found && product.id === Number(id)){
            product.name = newName;
        }
    });

    res.send("successful update!");
})
.delete('/products/:id', function(req, res){
    var id = req.params.id;

    var found = false;

    products.forEach(function(product, index){
        if (!found && product.id === Number(id)){
            products.splice(index, 1);
        }
        res.send("successful deletion");
    });

})
.listen(PORT, function() {
    console.log("server listening on port " + PORT);
});