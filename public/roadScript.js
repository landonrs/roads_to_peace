// get project info
$(function() {
    // GET/READ
    console.log("clicked button!!!");
    $('#project-button').on('click', function(){
        $.ajax({
            url: '/projects/1',
            contentType: 'application/json',
            success: function(response){
                var pDisplay = $('#project-display');
                console.log(pDisplay);
                console.log(JSON.stringify(response.projects[0]));
                pDisplay.html('');
                pDisplay.html(JSON.stringify(response.projects[0]));
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
            console.log("response is " + response);
            var pDisplay = $('#project-display');
            pDisplay.html('');
            if (response == "ERROR"){
                pDisplay.html("Error, your donation amount was invalid");
            } else{
                pDisplay.html("You donated $" + donation.amount + " to " + response.project[0].project_name);
            }
        }
    });
});

// get donation history
$(function() {
    // GET/READ
    console.log("clicked button!!!");
    $('#donation-history').on('click', function(){
        $.ajax({
            url: '/users/1',
            contentType: 'application/json',
            success: function(response){
                var pDisplay = $('#project-display');
                console.log(pDisplay);
                console.log(JSON.stringify(response.userHistory));
                pDisplay.html('');
                pDisplay.html(JSON.stringify(response.userHistory));
            }  
                });
            })
});