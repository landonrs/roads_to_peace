// get project info
$(function() {
    // GET/READ
    // //console.log("clicked button!!!");
    $('.project-display-button').on('click', function(){
        var projectId = $(this).val();
        //console.log(projectId);
        $.ajax({
            url: '/projects/' + projectId,
            contentType: 'application/json',
            success: function(response){
                var projectPage = $('#projects-display-page');
                projectPage.hide();
                var indProjectPage = $('#project-donation-page');
                
                // //console.log(JSON.stringify(response.projects[0]));
                $('#proj-id').val(response.projects[0].project_id);
                $('#project-title').html(response.projects[0].project_name);
                $('#project-img').attr('src', response.projects[0].image_url);
                $('#goal-display').html('Goal: $'+ response.projects[0].target_goal);
                $('#current-amount').html('$' + response.projects[0].current_donated_amount);
                $('#time-left').html(response.projects[0].time_left);
                var percent = (response.projects[0].current_donated_amount / response.projects[0].target_goal) * 100
                //console.log(percent)
                $('#bar-fillup').attr('style','width: '+ percent + '%');
                $('#project-text').html(response.projects[0].description);
                $('#project-display').html('');
                indProjectPage.show();
                window.scrollTo(0, 0);
            }  
                });
            })
});

// add donation to project
$('#donation-form').on('submit', function(event){
    event.preventDefault();
    $('#donation-error').hide()


    if($('#donation-hist-disp').val() == -1){
        $('#donation-error').show();
        return 0;
    }
    else if (isNaN($('#amount').val())){
        $('#donation-error').html('Invalid number entered for amount!');
        $('#donation-error').show();
        return 0;
    }

    var donation = {
        amount: $('#amount').val(),
        userID: $('#donation-hist-disp').val(),
        projectID: $('#proj-id').val(),
    };

    $.ajax({
        url: '/donate',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ amount: donation.amount, projectID: donation.projectID, userID: donation.userID }),
        success: function(response){
            $('#donation-modal').modal('toggle');
            //console.log("response is " + response);
            var pDisplay = $('#project-display');
            pDisplay.html('');
            if (response == "ERROR"){
                pDisplay.html("Error, your donation amount was invalid");
            } else{
                pDisplay.html("You donated $" + Math.floor(donation.amount) + " to " + response.project[0].project_name);
            }
            // update the current donated amount on the display
            $('#current-amount').html('');
            $('#current-amount').append('$' + response.project[0].current_donated_amount);
            var percent = (response.project[0].current_donated_amount / response.project[0].target_goal) * 100;
            //console.log(percent)
            $('#bar-fillup').attr('style','width: '+ percent + '%');

        }
    });
});

// get donation history
$(function() {
    // GET/READ
    $('#donation-hist-disp').on('click', function(){
        $.ajax({
            url: '/users/' + $('#donation-hist-disp').val(),
            contentType: 'application/json',
            success: function(response){
                $('.page').hide();
                //console.log(JSON.stringify(response.userHistory));
                if (response.userHistory[0] === undefined){   
                    //console.log("no donations!");
                }
                else{
                $('#no-donation-error').hide();
                $('#donation-redirect-button').hide();
                $('#donation-history-page').append("<h1>Your Donations</h1>");
                response.userHistory.forEach(element => {
                    $('#donation-history-page').append("<div class='rounded donation-history-box'>" +
                    "<h5>Project: " + element.project_name + "</h5><br>" +
                    "<h5>Donation Amount: $" + element.donation_amount + "</h5><br>" + 
                    "<h5>Donation Date: " + element.donation_date + "</h5><br>" +
                    "</div>");
                    
                
                })
            };
                $('#donation-history-page').show()
            }  
                });
            })
});

//display main projects page
$(function() {
    // GET/READ
    $('.projects-display-button').on('click', function(){
        //console.log("clicked projects button!");
        $.ajax({
            url: '/projects/main',
            contentType: 'application/json',
            success: function(response){
                $('.page').hide();
                var projectPage = $('#projects-display-page');
                $("#project-1-title").html(response.projects[0].project_name);
                $("#project-1-img").attr("src", response.projects[0].image_url);
                $("#project-1-id").val(response.projects[0].project_id);
                // insert project 2 data
                $("#project-2-title").html(response.projects[1].project_name);
                $("#project-2-img").attr("src", response.projects[1].image_url);
                $("#project-2-id").val(response.projects[1].project_id);
                projectPage.show();
                window.scrollTo(0, 0);
            }  
                });
            })
});

// Log in handler
$('#signIn-form').on('submit', function(event){
    event.preventDefault();

    var user = {
        username: $('#SI-username').val().toLowerCase(),
        password: $('#SI-password').val()
    };

    $.ajax({
        url: '/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: user.username, password: user.password }),
        success: function(response){
            //console.log("response is " + response);
            if (response == "ERROR"){
                $('#sign-in-error').show();
            } else{
                $('#signIn-modal').modal('toggle');
                // update the navbar to show the user name
                $('#sign-in').hide();
                $('#sign-up').hide();
                $('#donation-hist-disp').val(response.user[0].user_id);
                $('#sign-out').show();
                $('#donation-hist-disp').show();
                $('#user-greeting').html("Welcome " + user.username);
                $('#user-greeting').show();
            }
            

        }
    });
});

//sign up handler
$('#signUp-form').on('submit', function(event){
    event.preventDefault();

    var user = {
        username: $('#SU-username').val().toLowerCase(),
        password: $('#SU-password').val()
    };

    $.ajax({
        url: '/addUser',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username: user.username, password: user.password }),
        success: function(response){
            //console.log("response is " + response);
            if (response == "ERROR"){
                //console.log("error signing out");
            } else{
                $('#signUp-modal').modal('toggle');
                // update the navbar to show the user name
                $('#sign-in').hide();
                $('#sign-up').hide();
                $('#donation-hist-disp').val(response.user[0].user_id);
                $('#donation-hist-disp').show();
                $('#sign-out').show();
                $('#user-greeting').html("Welcome " + user.username);
                $('#user-greeting').show();
            }
            

        }
    });
});

// Sign out handler
$('#sign-out').on('click', function(){
   
    $.ajax({
        url: '/signout',
        method: 'POST',
        contentType: 'application/json',
        success: function(response){
            //console.log("response is " + response);
            if (response == "ERROR"){
                $('#sign-in-error').show();
            } else{
                // remove user name from navbar
                $('#donation-hist-disp').val(-1);
                $('#sign-out').hide();
                $('#donation-hist-disp').hide();
                $('#user-greeting').hide();
                $('#sign-in').show();
                $('#sign-up').show();
            }
            

        }
    });
});
// every time the page is refreshed, check if the user is already logged in.
$(document).ready(function () {
    $.ajax({
        url: '/checkLogIn',
        method: 'GET',
        contentType: 'application/json',
        success: function(response){
            //console.log("response is " + response);
            if (response.login != null){
                //console.log("user is logged in: " + response.login)
                // update the navbar to show the user name
                $('#sign-in').hide();
                $('#sign-up').hide();
                $('#donation-hist-disp').val(response.user_id);
                $('#donation-hist-disp').show();
                $('#sign-out').show();
                $('#user-greeting').html("Welcome " + response.login);
                $('#user-greeting').show();
            } 
            window.scrollTo(0, 0);
        }
    });

  });