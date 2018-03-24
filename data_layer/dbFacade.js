var conString = "postgres://postgres:root@localhost:5432/roads";
const { Client } = require('pg');
var bodyParser = require("body-parser");


function displayProjectPage(req, res){

    getAllProjects(function(error, result){
        console.log(result);
        res.send({ projects: result });
    })

}

function getAllProjects(callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

        var sql = "SELECT * from PROJECTS";

		var query = client.query(sql, function(err, result) {
        // we are now done getting the data from the DB, disconnect the client
        client.end(function(err) {
            if (err) throw err;
            
            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("Client disconnecting");

            // call whatever function the person that called us wanted, giving it
            // the results that we have been compiling
            callback(null, result.rows);
            });
        });
    })
};

function getProject(req, res){
    console.log("connecting to DB");
    var id = req.params.id;
    getProjectInfo(id, function(error, result){
         //console.log(result);
         res.send({ projects: result });
    })
	
}

function getProjectInfo(id, callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

        var sql = "SELECT * from PROJECTS WHERE PROJECT_ID =$1";
        var values = [id];

		var query = client.query(sql, values, function(err, result) {
        // we are now done getting the data from the DB, disconnect the client
        client.end(function(err) {
            if (err) throw err;
            
            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("Client disconnecting");

            // call whatever function the person that called us wanted, giving it
            // the results that we have been compiling
            callback(null, result.rows);
            });
        });
    })
};

function addDonation(req, res){
    var userID = req.body.userID;
    var projectID = req.body.projectID;
    var amount = req.body.amount;
    if (isNaN(amount)) {
        console.log("user did not enter number");
        res.send("ERROR");
    } else {

        var donation = {
            userID: userID,
            projectID: projectID,
            amount: Math.floor(amount)
        }

        insertDonation(donation, function(err, updateDetails){

            res.send({ project: updateDetails });
        })
    }
}

function insertDonation(donation, callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
    client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}
        //first insert the donation into the DB
        var sql = "INSERT INTO PROJECT_CONTRIBUTORS (PROJECT_ID, USER_ID, DONATION_AMOUNT) VALUES($1,$2,floor($3))";
        var values = [donation.projectID, donation.userID, donation.amount];

		var query = client.query(sql, values, function(err, result) {
            if (err) {
                console.log("Error in query: ")
                console.log(err);
                client.end();
                callback(err, null);
            }
        });

        //Now update the project to reflect the added donation
        var sql = "UPDATE PROJECTS SET CURRENT_DONATED_AMOUNT = CURRENT_DONATED_AMOUNT + floor($1) WHERE PROJECT_ID = $2 RETURNING *";
        var values = [donation.amount, donation.projectID];
        var query = client.query(sql, values, function(err, result) {
            //check for error, if the transaction is good commit to DB
            if(err){
                console.log(err);
            } 
            else {
                client.query('COMMIT', (err) => {
                if (err) {
                  console.error('Error committing transaction', err.stack)
                }
                // we are now done updating the DB, disconnect the client
                client.end(function(err) {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        console.log("diconnecting from DB!");
                    }

                    console.log("updated project: " + JSON.stringify(result.rows));

                    // call whatever function the person that called us wanted, giving it
                    // the results that we have been compiling
                    callback(null, result.rows);
                });
              })
            }
		});
        
      
    })
}

function getUserDonations(req, res){
    console.log("connecting to DB");
    var id = req.params.id;
    getDonationInfo(id, function(error, result){
        //console.log(result);
        res.send({ userHistory: result });
    });
}

function getDonationInfo(id, callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
		}

        var sql = "SELECT PROJECT_NAME, DONATION_AMOUNT, to_char(DONATION_DATE, 'DD-Mon-YYYY') AS DONATION_DATE " + 
                    "from PROJECT_CONTRIBUTORS pc JOIN PROJECTS p ON p.project_id = pc.project_id " +
                    "WHERE USER_ID =$1";
        var values = [id];

		var query = client.query(sql, values, function(err, result) {
        // we are now done getting the data from the DB, disconnect the client
        client.end(function(err) {
            if (err) throw err;
            
            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log("found results");

            // call whatever function the person that called us wanted, giving it
            // the results that we have been compiling
            callback(null, result.rows);
            });
        });
    })
}

function logInUser(req, res){
    //checking session variable
    console.log(req.session.userID);
    var user = {
        username: req.body.username,
        password: req.body.password
    }

    checkLogIn(user, function(err, result){
        if(err){
            res.send("ERROR");
        }
        else{
            req.session.userID = result[0].user_id;
            req.session.signedIn = true;
            console.log(result[0]);
            res.send({user: result})
        }
    })
}

function checkLogIn(user, callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
        }
        console.log(user.username);
        console.log(user.password);

        var sql = "SELECT USER_ID FROM USERS WHERE USERNAME = $1 and password = $2";
        var values = [user.username, user.password];

		var query = client.query(sql, values, function(err, result) {
        // we are now done getting the data from the DB, disconnect the client
        client.end(function(err) {
            if (err) throw err;
            
            if (err) {
                console.log("Error in query: ")
                console.log(err);
                callback(err, null);
            }

            console.log(result);

            // if no user was returned, send an error
            if (result.rowCount == 0){
                callback("NO RESULT", null)
            }
            else{
                callback(null, result.rows);
            }
            });
        });
    })
}

function addUser(req, res){
    console.log(req.session.userID);
    var user = {
        username: req.body.username,
        password: req.body.password
    }

    checkUsername(user, function(err, result){
        if(err){
            res.send("ERROR");
        }
        else{
            req.session.userID = result[0].user_id
            console.log(result[0]);
            res.send({user: result})
        }
    })
}

function checkUsername(user, callback){
    const client = new Client({
        connectionString: process.env.DATABASE_URL || conString,
        //UNCOMMENT THIS WHEN PUSHING TO HEROKU!
        //ssl: true,
      });
	client.connect(function(err) {
		if (err) {
			console.log("Error connecting to DB: ")
			console.log(err);
			callback(err, null);
        }
        console.log(user.username);
        console.log(user.password);

        var sql = "SELECT USER_ID FROM USERS WHERE USERNAME = $1";
        var values = [user.username];

		var query = client.query(sql, values, function(err, result) {
            if (err || result.rowCount != 0) {
                console.log("Error in query: Username exists")
                console.log(err);
                client.end();
                callback("ERROR", null);
            }
        });

        //Now insert the user into the DB
        var sql = "INSERT INTO USERS (username, password) VALUES($1, $2) RETURNING *";
        var values = [user.username, user.password];
        var query = client.query(sql, values, function(err, result) {
            //check for error, if the transaction is good commit to DB
            if(err){
                console.log(err);
            } 
            else {
                client.query('COMMIT', (err) => {
                if (err) {
                  console.error('Error committing transaction', err.stack)
                }
                // we are now done inserting into the DB, disconnect the client
                client.end(function(err) {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        console.log("diconnecting from DB!");
                    }

                    console.log("inserted user: " + JSON.stringify(result.rows));

                    // call whatever function the person that called us wanted, giving it
                    // the results that we have been compiling
                    callback(null, result.rows);
                });
              })
            }
		});
});
}


module.exports = {getProject: getProject, addDonation: addDonation, getUserDonations: getUserDonations, 
    displayProjectPage: displayProjectPage, logInUser: logInUser, addUser: addUser};

