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
            console.log(response);
            var pDisplay = $('#project-display');
            pDisplay.html('');
            pDisplay.html("You donated $" + donation.amount + " to " + response.project[0].project_name);
        }
    });
});