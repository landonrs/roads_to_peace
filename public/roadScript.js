// get project info
$(function() {
    // GET/READ
    // console.log("clicked button!!!");
    $('.project-display-button').on('click', function(){
        $.ajax({
            url: '/projects/' + $('#project-1-id').val(),
            contentType: 'application/json',
            success: function(response){
                var projectPage = $('#projects-display-page');
                projectPage.hide();
                var indProjectPage = $('#project-donation-page');
                
                console.log(JSON.stringify(response.projects[0]));
                $('#project-title').html(response.projects[0].project_name);
                $('#project-img').attr('src', 'test.jpg');
                $('#goal-display').html('Goal: $'+ response.projects[0].target_goal);
                $('#current-amount').html('$' + response.projects[0].current_donated_amount);
                var percent = (response.projects[0].current_donated_amount / response.projects[0].target_goal) * 100
                console.log(percent)
                $('#bar-fillup').attr('style','width: '+ percent + '%');
                $('#project-text').html(response.projects[0].description);

                // pDisplay.html('');
                // pDisplay.html(JSON.stringify(response.projects[0]));
                //tDiv.hide(1000);
                indProjectPage.show();
            }  
                });
            })
});

// add donation to project
$('#donation-form').on('submit', function(event){
    event.preventDefault();

    var donation = {
        amount: $('#amount').val(),
        userID: 1,
        projectID: 1,
    };

    $.ajax({
        url: '/donate',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ amount: donation.amount, projectID: donation.projectID, userID: donation.userID }),
        success: function(response){
            $('#donation-modal').modal('toggle');
            console.log("response is " + response);
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
            console.log(percent)
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
                console.log(JSON.stringify(response.userHistory));
                response.userHistory.forEach(element => {
                    $('#donation-history-page').append("<h5>Project: " + element.project_name + "</h5><br>");
                    $('#donation-history-page').append("<h5>Donation Amount: $" + element.donation_amount + "</h5><br>");
                    $('#donation-history-page').append("<h5>Donation Date: " + element.donation_date + "</h5><br>");
                    

                });
                $('#donation-history-page').show()
            }  
                });
            })
});

//display main projects page
$(function() {
    // GET/READ
    $('.projects-display-button').on('click', function(){
        $.ajax({
            url: '/projects/main',
            contentType: 'application/json',
            success: function(response){
                $('.page').hide();
                var projectPage = $('#projects-display-page');
                $("#project-1-title").html(response.projects[0].project_name);
                $("#project-1-img").attr("src", "test.jpg");
                $("#project-1-id").val(response.projects[0].project_id);
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
            console.log("response is " + response);
            if (response == "ERROR"){
                $('#sign-in-error').show();
            } else{
                $('#signIn-modal').modal('toggle');
                // update the navbar to show the user name
                $('#sign-in').hide();
                $('#sign-up').hide();
                $('#donation-hist-disp').val(response.user[0].user_id);
                $('#donation-hist-disp').show();
                $('#user-greeting').html("Welcome " + user.username);
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
            console.log("response is " + response);
            if (response == "ERROR"){
                $('#sign-up-error').show();
            } else{
                $('#signUp-modal').modal('toggle');
                // update the navbar to show the user name
                $('#sign-in').hide();
                $('#sign-up').hide();
                $('#donation-hist-disp').val(response.user[0].user_id);
                $('#donation-hist-disp').show();
                $('#user-greeting').html("Welcome " + user.username);
            }
            

        }
    });
});